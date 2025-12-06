const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../services/tasksService');

async function getTasksHandler(req, res, next) {
  try {
    const tasks = await getAllTasks();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

async function getTaskByIdHandler(req, res, next) {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function createTaskHandler(req, res, next) {
  try {
    const task = await createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

async function updateTaskHandler(req, res, next) {
  try {
    const updated = await updateTask(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Task not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteTaskHandler(req, res, next) {
  try {
    const ok = await deleteTask(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Task not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTasksHandler,
  getTaskByIdHandler,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
};