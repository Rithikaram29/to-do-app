const express = require('express');
const { z } = require('zod');
const { validateBody } = require('../middleware/validateRequesst.js');
const {
  getTasksHandler,
  getTaskByIdHandler,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} = require('../controllers/tasksController');

const router = express.Router();

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  dueDate: z.string().datetime().optional(),
});

const updateTaskSchema = createTaskSchema.partial().extend({
  dueDate: z.string().datetime().nullable().optional(),
});

router.get('/', getTasksHandler);
router.get('/:id', getTaskByIdHandler);
router.post('/', validateBody(createTaskSchema), createTaskHandler);
router.put('/:id', validateBody(updateTaskSchema), updateTaskHandler);
router.delete('/:id', deleteTaskHandler);

module.exports = router;