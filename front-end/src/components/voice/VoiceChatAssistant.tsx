import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/useRedux";
import { setTasks } from "../../store/taskSlice";
import {
  fetchTasks,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
  parseVoiceApi,
} from "../../api/taskApi";

import type { ChatVoiceParsedTask, Task } from "../../types/task";
import { useSpeechToText } from "../../hooks/useSpeechToText"; // 👈 NEW
import { parse } from "date-fns";

const PARSER_OPTIONS = [
  { id: "openai", label: "openai" },
  { id: "gemini", label: "gemini" },
];

type ChatMessage = {
  id: string;
  sender: "user" | "bot";
  text: string;
};

const VoiceChatAssistant: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks: Task[] = useSelector((state: any) => state.tasks.items);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [parserId, setParserId] = useState<string>("openai");
  const [isMinimized, setIsMinimized] = useState(false);

  const {
    listening,
    transcript,
    error: sttError,
    start,
    stop,
    setTranscript,
  } = useSpeechToText();

  const addMessage = (sender: "user" | "bot", text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        sender,
        text,
      },
    ]);
  };

  const refreshTasks = async () => {
    const latestTasks = await fetchTasks();
    dispatch(setTasks(latestTasks));
  };

  const handleCrudFromParsed = async (parsed: ChatVoiceParsedTask) => {
    const { action, taskName, fieldToUpdate, newValue, confirmed } = parsed;

    if (!confirmed || action === "NONE") {
      addMessage(
        "bot",
        parsed.reason ||
          "I won’t change anything until you clearly confirm what you want me to do."
      );
      return;
    }

    if (!taskName) {
      addMessage("bot", "I couldn’t detect which task you meant.");
      return;
    }

    try {
      switch (action) {
        case "CREATE": {
          // You can extend this to use description / priority / dueDate when your parser sends them
          await createTaskApi({
            title: taskName,
            status: "todo",
          } as Partial<Task>);

          addMessage("bot", `Okay, I created a new task: "${taskName}".`);
          break;
        }

        case "UPDATE": {
          const task = tasks.find(
            (t) => t.title.toLowerCase() === taskName.toLowerCase()
          );
          if (!task) {
            addMessage(
              "bot",
              `I couldn’t find a task called "${taskName}" to update.`
            );
            return;
          }

          if (!fieldToUpdate || newValue == null) {
            addMessage(
              "bot",
              `I need both which field to update and the new value.`
            );
            return;
          }

          const changes: Partial<Task> = {};

          // Map the generic field name to your Task shape
          switch (fieldToUpdate.toLowerCase()) {
            case "title":
            case "name":
              changes.title = newValue;
              break;
            case "description":
              changes.description = newValue;
              break;
            case "priority":
              changes.priority = newValue as Task["priority"];
              break;
            case "status":
              changes.status = newValue as Task["status"];
              break;
            case "due date":
            case "dueDate":
              changes.dueDate = newValue;
              break;
            default:
              addMessage(
                "bot",
                `I’m not sure how to update the field "${fieldToUpdate}".`
              );
              return;
          }

          await updateTaskApi(task.id, changes);
          addMessage(
            "bot",
            `Updated "${taskName}": set ${fieldToUpdate} to "${newValue}".`
          );
          break;
        }

        case "DELETE": {
          const task = tasks.find(
            (t) => t.title.toLowerCase() === taskName.toLowerCase()
          );
          if (!task) {
            addMessage(
              "bot",
              `I couldn’t find a task called "${taskName}" to delete.`
            );
            return;
          }

          await deleteTaskApi(task.id);
          addMessage("bot", `Deleted the task "${taskName}".`);
          break;
        }

        default: {
          addMessage("bot", `I’m not sure which action to perform.`);
          break;
        }
      }

      // Always refresh the list so board + list view stay in sync
      await refreshTasks();
    } catch (err) {
      console.error("Error performing CRUD from parsed voice:", err);
      addMessage(
        "bot",
        "Something went wrong while updating your tasks. Please try again."
      );
    }
  };

  useEffect(() => {
    // When recording stops and we have text, send it to the API
    const handle = async () => {
      if (!listening && transcript && !isLoading) {
        const spoken = transcript;
        setTranscript(""); // clear for the next round

        addMessage("user", spoken);
        setIsLoading(true);

        try {
          const parses = await parseVoiceApi({ parserId, transcript: spoken });
          const parsed = parses?.raw;
          console.log("parsed_raw:", parses);

          if (!parses?.status) {
            addMessage("bot", parsed as string);
          } else {
            addMessage(
              "bot",
              `I understood this as a "${parsed?.action}" request for task "${
                parsed?.taskName || "unknown"
              }".`
            );
            await handleCrudFromParsed(parsed);
          }
        } catch (err) {
          console.error("Error calling parseVoiceApi:", err);
          addMessage(
            "bot",
            "I couldn’t understand that due to a server error. Please try again."
          );
        } finally {
          setIsLoading(false);
        }
      }
    };

    void handle();
  }, [listening, transcript, isLoading, setTranscript, parserId]);

return (
  <div className="voice-chat-assistant scroll-m-1 flex flex-col max-h-[70vh] p-3">
    <div className="voice-chat-header flex items-center justify-between gap-2">
      <span>Task Assistant</span>
      <button
        type="button"
        onClick={() => setIsMinimized((prev) => !prev)}
        className="text-xs px-2 py-1 rounded border border-slate-600 hover:bg-slate-800"
      >
        {isMinimized ? "^" : "-"}
      </button>
    </div>

    {!isMinimized && (
      <>
        <div className="voice-chat-messages flex-1 overflow-y-auto">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`voice-chat-message ${
                m.sender === "user" ? "from-user" : "from-bot"
              }`}
            >
              <span>{m.text}</span>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="voice-chat-placeholder">
              {/* your placeholder text if you want */}
            </div>
          )}
        </div>

        <div className="voice-chat-parser-row">
          <label
            style={{
              fontSize: "0.8rem",
              opacity: 0.8,
              marginRight: "0.5rem",
            }}
          >
            Chat device:
          </label>
          <select
            value={parserId}
            onChange={(e) => setParserId(e.target.value)}
            style={{
              background: "#020617",
              color: "#e5e7eb",
              borderRadius: "6px",
              border: "1px solid #374151",
              padding: "0.25rem 0.5rem",
              fontSize: "0.8rem",
            }}
          >
            {PARSER_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {transcript && <div className="transcript-box">{transcript}</div>}

        <div className="voice-chat-input-row">
          <button
            type="button"
            onClick={() => (listening ? stop() : start())}
            className={`mic-button ${listening ? "active" : ""}`}
            disabled={isLoading}
          >
            {listening ? "Stop" : "Speak"}
          </button>

          {sttError && (
            <p
              className="error-text"
              style={{ fontSize: "0.75rem", marginLeft: "0.5rem" }}
            >
              {sttError}
            </p>
          )}
        </div>
      </>
    )}
  </div>
);
};

export default VoiceChatAssistant;
