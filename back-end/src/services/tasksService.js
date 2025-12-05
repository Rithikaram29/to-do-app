const { v4: uuid } = require('uuid');

// In-memory store for now
let tasks = [];

// GET all tasks
function getAllTasks() {
  return tasks;
}

// GET task by id
function getTaskById(id) {
  return tasks.find((t) => t.id === id);
}

// CREATE task
function createTask(input) {
  const now = new Date().toISOString();
  const task = {
    id: uuid(),
    title: input.title,
    description: input.description,
    status: input.status || 'todo',
    priority: input.priority || 'medium',
    dueDate: input.dueDate,
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(task);
  return task;
}

// UPDATE task
function updateTask(id, changes) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const existing = tasks[index];
  const updated = {
    ...existing,
    ...changes,
    // allow clearing dueDate with null
    dueDate:
      changes.dueDate === null
        ? undefined
        : changes.dueDate !== undefined
        ? changes.dueDate
        : existing.dueDate,
    updatedAt: new Date().toISOString(),
  };

  tasks[index] = updated;
  return updated;
}

// DELETE task
function deleteTask(id) {
  const lengthBefore = tasks.length;
  tasks = tasks.filter((t) => t.id !== id);
  return tasks.length < lengthBefore;
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};