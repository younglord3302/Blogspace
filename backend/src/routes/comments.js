const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');

// Public: get approved comments for a post
router.get('/post/:postId', commentController.getCommentsForPost);

// User: add comment
router.post('/post/:postId', authMiddleware, commentController.createComment);

// Admin moderation
router.get('/', authMiddleware, requireAdmin, commentController.getComments);
router.put('/:id', authMiddleware, requireAdmin, commentController.updateCommentStatus);
router.delete('/:id', authMiddleware, requireAdmin, commentController.deleteComment);

module.exports = router;
