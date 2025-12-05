const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../services/tasksService');

function getTasksHandler(req, res, next) {
  try {
    const tasks = getAllTasks();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

function getTaskByIdHandler(req, res, next) {
  try {
    const task = getTaskById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
}

function createTaskHandler(req, res, next) {
  try {
    const task = createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

function updateTaskHandler(req, res, next) {
  try {
    const updated = updateTask(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Task not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

function deleteTaskHandler(req, res, next) {
  try {
    const ok = deleteTask(req.params.id);
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