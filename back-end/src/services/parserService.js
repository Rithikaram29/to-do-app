import { parseRelativeDate } from "../utils/dateUtils.js";
import { getAllTasks } from "./tasksService.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// parserService.js

// Which parser to use: "local" (rules), "openai", or "gemini"
export const PARSER_PROVIDER = {
  LOCAL: "local",
  OPENAI: "openai",
  GEMINI: "gemini",
};


// System prompt used for OpenAI / Gemini
const VOICE_CRUD_SYSTEM_PROMPT = `
You are a voice-based task assistant that performs CRUD operations on a task list. You must always follow this workflow when interpreting the user’s speech:

Detect the CRUD intent:

CREATE → user wants to add a new task.
UPDATE → user wants to modify an existing task.
DELETE → user wants to remove an existing task.

Extract required information:
For CREATE → task name (mandatory), optional description, priority, due date.
For UPDATE → task name + the field the user wants to change + the new value.
For DELETE → task name.

Check current state of the task list:
If the user asks to update/delete a task that does not exist → tell them it doesn't exist and ask if they want to create it.
If the user asks to create a task that already exists → ask if they want to update instead.

Before doing ANY modification, always ask for confirmation:
Repeat exactly what you think the user wants.
Example: “You want me to create a task called ‘buy groceries’. Should I go ahead?”
Only proceed when the user clearly says yes.

On confirmation, return a JSON action block like this:

{
  "action": "CREATE | UPDATE | DELETE",
  "taskName": "string",
  "fieldToUpdate": "optional string",
  "newValue": "optional string",
  "confirmed": true
}

If not confirmed, return:

{ "action": "NONE", "reason": "User did not confirm" }

All other output (conversation text) should be natural voice-assistant style.
`;

// Local rules parser: heuristic, similar to your frontend
function parseWithLocalRules(transcript) {
  
  const lower = transcript.toLowerCase();
  let priority;
  let status = 'todo';

  if (lower.includes('critical')) priority = 'critical';
  else if (lower.includes('urgent') || lower.includes('high priority'))
    priority = 'high';
  else if (lower.includes('low priority')) priority = 'low';
  else if (lower.includes('medium priority')) priority = 'medium';

  if (lower.includes('in progress')) status = 'in_progress';
  else if (lower.includes('done') || lower.includes('completed')) status = 'done';

  const dueDate = parseRelativeDate(lower);

  let title = transcript;

  const PREFIXES = [
    'create a task to',
    'create task to',
    'create a task',
    'create task',
    'remind me to',
    'remind me',
    'add a task to',
  ];

  for (const prefix of PREFIXES) {
    if (lower.startsWith(prefix)) {
      title = transcript.slice(prefix.length).trim();
      break;
    }
  }

  title = title.replace(/by (tomorrow|next week).*/i, '').trim();
  title = title.replace(/it'?s (high|low|medium|critical) priority.*/i, '').trim();

  if (!title) title = transcript;

  return {
    transcript,
    title,
    status,
    priority,
    dueDate,
  };
}

// Uses OpenAI Chat Completions to parse transcript
async function parseWithOpenAI(transcript) {
  const apiKey = process.env.OPENAI_API_KEY;

  console.log("openapi_key:", apiKey);
  if (!apiKey) {
    console.error("Missing OPENAI_API_KEY");
    return { action: "NONE", reason: "OpenAI not configured" };
  }
    
  const tasks = await getAllTasks();

  const taskListSummary = JSON.stringify(
    tasks.map((t) => ({
      name: t.title || t.name,
      status: t.status,
      priority: t.priority,
      id: t.id,
    }))
  );

  const userMessage = `
User said (transcript):
"${transcript}"

Current tasks:
${taskListSummary}

Remember: respond with natural language PLUS a JSON action block at the end.
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini", // or whichever model you use
      messages: [
        { role: "system", content: VOICE_CRUD_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.2,
    }),
  });

  console.log("response_from_openai", response);
  if(response.statusText === "Too Many Requests"){
    return {
      status:false,
      raw: "Your api key has reached it's limit"
    }
  }
  let json;
  let content;
  if(typeof(json) === "object"){
  json = await response.json();
  content = json.choices?.[0]?.message?.content || "";
  } else {
    json = response;
    content = response;
  }



  // You can parse out the JSON at the end if you format it consistently.
  // For now, just return raw text and let caller handle parsing.
  return {
    status: true,
    raw: content,
  };
}


async function parseWithGemini(transcript) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY");
    return { status: false, raw: "Gemini not configured (missing GEMINI_API_KEY)" };
  }

  const tasks = await getAllTasks();
  const taskListSummary = JSON.stringify(
    tasks.map((t) => ({
      name: t.title || t.name,
      status: t.status,
      priority: t.priority,
      id: t.id,
    }))
  );

  const prompt = `
${VOICE_CRUD_SYSTEM_PROMPT}

User said (transcript):
"${transcript}"

Current tasks:
${taskListSummary}

Remember: respond with natural language PLUS a JSON action block at the end.
`.trim();

  try {
    const genAI = new GoogleGenerativeAI(apiKey);


    const model = genAI.getGenerativeModel({ model: "gemini-1.0-flash" });
   

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return {
      status: true,
      raw: text,
    };
  } catch (err) {
    console.error("Error calling Gemini via SDK:", err);
    return {
      status: false,
      raw: `Error calling Gemini: ${err?.message || String(err)}`,
    };
  }
}

export async function parseTranscript(parserId, transcript) {
  switch (parserId) {
    case 'local_rules':
      return parseWithLocalRules(transcript);
    case 'openai':
      return parseWithOpenAI(transcript);
    case 'gemini':
      return parseWithGemini(transcript);
    default:
      throw new Error('Unknown parserId: ' + parserId);
  }
}
