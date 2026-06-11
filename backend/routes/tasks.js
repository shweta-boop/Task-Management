const express = require('express');
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('title', 'Task title is required').notEmpty().trim(),
    body('description', 'Description must be a string').optional().isString(),
    body('priority', 'Priority must be low, medium, or high').optional().isIn(['low', 'medium', 'high']),
    body('dueDate', 'Due date must be a valid date').optional().isISO8601(),
  ],
  taskController.createTask
);

router.get('/', taskController.getTasks);

router.get('/:id', taskController.getTaskById);

router.put(
  '/:id',
  [
    body('title', 'Task title must be a string').optional().isString().trim(),
    body('description', 'Description must be a string').optional().isString(),
    body('status', 'Status must be pending, in-progress, or completed').optional().isIn(['pending', 'in-progress', 'completed']),
    body('priority', 'Priority must be low, medium, or high').optional().isIn(['low', 'medium', 'high']),
    body('dueDate', 'Due date must be a valid date').optional().isISO8601(),
  ],
  taskController.updateTask
);

router.delete('/:id', taskController.deleteTask);

module.exports = router;
