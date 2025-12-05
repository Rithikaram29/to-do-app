const { parseRelativeDate } = require('../utils/dateUtils');

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

// TODO: implement with OpenAI later
async function parseWithOpenAI(transcript) {
  // Example placeholder
  // throw new Error('OpenAI parser not implemented yet');
  // For now, we can just fallback to local rules:
  return parseWithLocalRules(transcript);
}

// TODO: implement with Gemini later
async function parseWithGemini(transcript) {
  // Example placeholder
  // throw new Error('Gemini parser not implemented yet');
  // For now, fallback:
  return parseWithLocalRules(transcript);
}

async function parseTranscript(parserId, transcript) {
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

module.exports = {
  parseWithLocalRules,
  parseWithOpenAI,
  parseWithGemini,
  parseTranscript,
};