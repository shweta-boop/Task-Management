const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authorizeRole } = require('../middleware/roleAuth');

const router = express.Router();

router.post(
  '/register',
  [
    body('username', 'Username is required and must be at least 3 characters').trim().isLength({ min: 3 }),
    body('email', 'Email is required and must be valid').isEmail(),
    body('password', 'Password is required and must be at least 6 characters').isLength({ min: 6 }),
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email', 'Email is required and must be valid').isEmail(),
    body('password', 'Password is required').notEmpty(),
  ],
  authController.login
);

router.get('/me', protect, authController.getCurrentUser);

router.get('/users', protect, authorizeRole('Manager', 'Team Lead'), authController.getAllUsers);

router.post('/assign-team-members', protect, authorizeRole('Manager', 'Team Lead'), authController.assignTeamMembers);

module.exports = router;
