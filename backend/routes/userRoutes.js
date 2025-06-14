const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
  getUserStats
} = require('../controllers/userController');

const { authenticateToken } = require('../middleware/auth');
const {
  validateCreateUser,
  validateUpdateUser,
  validateUserId,
  validateFollowRequest
} = require('../middleware/validation');

// All user routes require authentication
router.use(authenticateToken);

// User CRUD routes
router.get('/', getUsers);
router.get('/stats', getUserStats);
router.get('/:id', validateUserId, getUserById);
router.post('/', validateCreateUser, createUser);
router.put('/:id', validateUserId, validateUpdateUser, updateUser);
router.delete('/:id', validateUserId, deleteUser);

// Follow/Unfollow routes
router.post('/:id/follow', validateUserId, validateFollowRequest, followUser);
router.delete('/:id/follow', validateUserId, validateFollowRequest, unfollowUser);

module.exports = router;