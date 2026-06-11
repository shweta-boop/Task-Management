const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const User = require('../models/User');

exports.createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority, dueDate, assignedTo } = req.body;
    const userId = req.user.id;

    let assignedToId = assignedTo || userId;

    if (req.user.role === 'Employee' && assignedTo && assignedTo !== userId) {
      return res.status(403).json({ message: 'Employees can only assign tasks to themselves' });
    }

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      createdBy: userId,
      assignedTo: assignedToId,
    });

    await task.save();
    //await task.populate(['createdBy', 'assignedTo'], 'username email role');
    await task.populate([{ path: 'createdBy', select: 'username email role' }, {path: 'assignedTo',select: 'username email role'}]);
    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { status, role } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = {};

    if (userRole === 'Employee') {
      query.$or = [{ assignedTo: userId }, { createdBy: userId }];
    } else if (userRole === 'Team Lead') {
      const teamLead = await User.findById(userId);
      const teamMemberIds = teamLead.teamMembers || [];
      query.$or = [
        { assignedTo: { $in: teamMemberIds } },
        { createdBy: userId },
        { assignedTo: userId },
      ];
    } else if (userRole === 'Manager') {
      // Managers can see all tasks
    }

    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query)
      .populate('createdBy', 'username email role')
      .populate('assignedTo', 'username email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'username email role')
      .populate('assignedTo', 'username email role');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    const canAccess =
      userRole === 'Manager' ||
      task.createdBy._id.equals(userId) ||
      task.assignedTo._id.equals(userId);

    if (!canAccess) {
      const user = await User.findById(userId);
      if (user.teamMembers && user.teamMembers.includes(task.assignedTo._id)) {
        // Team Lead can view tasks of their team members
      } else {
        return res.status(403).json({ message: 'Not authorized to access this task' });
      }
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    let canUpdate = false;

    if (userRole === 'Manager') {
      canUpdate = true;
    } else if (userRole === 'Team Lead') {
      const user = await User.findById(userId);
      if (
        task.createdBy.equals(userId) ||
        task.assignedTo.equals(userId) ||
        (user.teamMembers && user.teamMembers.includes(task.assignedTo))
      ) {
        canUpdate = true;
      }
    } else if (userRole === 'Employee') {
      if (task.createdBy.equals(userId) || task.assignedTo.equals(userId)) {
        canUpdate = true;
      }
    }

    if (!canUpdate) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    if (assignedTo) {
      if (userRole === 'Employee' && assignedTo !== userId) {
        return res.status(403).json({ message: 'Employees can only reassign tasks to themselves' });
      }
      task.assignedTo = assignedTo;
    }

    task.updatedAt = new Date();
    await task.save();
    await task.populate([{ path: 'createdBy', select: 'username email role' }, {path: 'assignedTo',select: 'username email role'}]);
   // await task.populate(['createdBy', 'assignedTo'], 'username email role');

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    let canDelete = false;

    if (userRole === 'Manager') {
      canDelete = true;
    } else if (userRole === 'Team Lead') {
      if (task.createdBy.equals(userId)) {
        canDelete = true;
      }
    } else if (userRole === 'Employee') {
      if (task.createdBy.equals(userId)) {
        canDelete = true;
      }
    }

    if (!canDelete) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
