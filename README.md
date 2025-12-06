# Voice-Enabled Task Tracker

This is a full-stack task management application with a voice-enabled interface. It allows users to manage their tasks through a graphical interface and also by using their voice.

## 1. Project Setup

### a. Prerequisites

- **Node.js:** It is recommended to use the latest LTS version of Node.js.
- **Supabase:** A Supabase project is used for the database. You will need the project URL and the anon key.
- **API Keys:** The application uses OpenAI and Google Gemini for voice parsing. You will need API keys for these services.

### b. Installation

1.  **Backend:**
    ```bash
    cd back-end
    npm install
    ```

2.  **Frontend:**
    ```bash
    cd front-end
    npm install
    ```

### c. How to configure email sending/receiving

Email functionality is not implemented in this project, since it's a single user interface.

### d. How to run everything locally

1.  **Backend:**
    - Create a `.env` file in the `back-end` directory and add the following environment variables:
      ```
      SUPABASE_URL=<your-supabase-url>
      SUPABASE_ANON_KEY=<your-supabase-anon-key>
      OPENAI_API_KEY=<your-openai-api-key>
      GEMINI_API_KEY=<your-gemini-api-key>
      ```
    - Start the backend server:
      ```bash
      npm run dev
      ```
    The server will be running on `http://localhost:4000`.

2.  **Frontend:**
    - Start the frontend development server:
      ```bash
      npm run dev
      ```
    The application will be accessible at `http://localhost:5173`.

### e. Any seed data or initial scripts

There are no seed data or initial scripts for this project. You can start by creating new tasks through the UI or the API.

## 2. Tech Stack

- **Frontend:**
  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - Redux Toolkit
  - @dnd-kit/core
- **Backend:**
  - Node.js
  - Express.js
- **Database:**
  - Supabase
- **AI Providers:**
  - OpenAI
  - Google Gemini
- **Key Libraries:**
  - Zod (for data validation)
  - Axios (for HTTP requests)

## 3. API Documentation

The backend exposes a REST API for managing tasks and parsing voice commands.

### Main Endpoints

#### Tasks API

- **`GET /api/tasks`**: Get all tasks.
  - **Success Response (200):**
    ```json
    [
      {
        "id": "1",
        "title": "My first task",
        "description": "This is a description",
        "status": "todo",
        "priority": "medium",
        "dueDate": "2025-12-31T23:59:59.999Z"
      }
    ]
    ```

- **`POST /api/tasks`**: Create a new task.
  - **Request Body:**
    ```json
    {
      "title": "A new task",
      "description": "Description for the new task",
      "status": "in_progress",
      "priority": "high"
    }
    ```
  - **Success Response (201):**
    ```json
    {
      "id": "2",
      "title": "A new task",
      "description": "Description for the new task",
      "status": "in_progress",
      "priority": "high",
      "dueDate": null
    }
    ```

- **`PUT /api/tasks/:id`**: Update an existing task.
  - **Request Body:**
    ```json
    {
      "status": "done"
    }
    ```
  - **Success Response (200):**
    ```json
    {
      "id": "1",
      "title": "My first task",
      "description": "This is a description",
      "status": "done",
      "priority": "medium",
      "dueDate": "2025-12-31T23:59:59.999Z"
    }
    ```

- **`DELETE /api/tasks/:id`**: Delete a task.
  - **Success Response (204):** No content.

#### Voice API

- **`POST /api/voice/parse`**: Parse a voice transcript to extract task information.
  - **Request Body:**
    ```json
    {
      "parserId": "openai",
      "transcript": "create a new task to buy milk"
    }
    ```
  - **Success Response (200):**
    ```json
    {
      "action": "create",
      "task": {
        "title": "buy milk"
      }
    }
    ```

## 4. Decisions & Assumptions

- **Backend Architecture:** The backend is a straightforward RESTful API built with Express.js, which is a common and effective choice for such applications.
- **Frontend State Management:** Redux Toolkit is used for managing the application's state on the frontend, which helps in maintaining a predictable state container.
- **Voice Parsing:** The application supports multiple AI providers for parsing voice transcripts. This allows for flexibility and fallback options.
- **Data Validation:** Zod is used for validating incoming request data on the backend, which ensures data integrity.
- **Assumptions:**
  - The voice transcripts are in English.
  - The user has a stable internet connection for the API requests to the AI providers to work.

## 5. AI Tools Usage

I used Chatgpt agents to code faster.

### a. AI tools used while building
- chatGpt
- Gemini CLI

### b. What they helped with
- Backend route scaffolding
- Parser development
- Gemini model debugging
- UI design guidance
- README generation and refinement

### c. Any notable prompts/approaches
### 🎤 Voice Assistant Workflow
1.	User speaks → STT converts to transcript
2.	Transcript sent to backend
3.	AI detects:
	•	Intent (CREATE / UPDATE / DELETE)
	•	Task name
	•	Field updates (priority, due date, status, description)
4.	Assistant asks for confirmation
5.	If user says yes, CRUD action is executed
6.	Redux updates the UI instantly

### AI Logic Overview
## CREATE

Extracts:
	•	title
	•	description?
	•	priority?
	•	dueDate?

Prevents duplicates by checking if task already exists.

## UPDATE
Extracts:
	•	taskName
	•	fieldToUpdate
	•	newValue

If the task doesn’t exist → asks user whether to create it instead.

## DELETE
Confirms:
	•	Task existence
	•	User intent

Confirmation Layer
No change happens until user explicitly confirms.

### d. What you learned or changed because of these tools
- Gemini requires exact model naming (gemini-1.5-flash etc.)
- OpenAI is stronger at structured JSON extraction
- Voice interfaces need confirmation layers to avoid accidental deletes
- Drag-and-drop with dnd-kit is extremely flexible
