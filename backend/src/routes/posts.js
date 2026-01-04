const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');

// Public
router.get('/', postController.getPosts);
router.get('/:slug', postController.getPostBySlug);

// Admin/author (for now: admin only; later you can allow authors)
router.post('/', authMiddleware, requireAdmin, postController.createPost);
router.put('/:id', authMiddleware, requireAdmin, postController.updatePost);
router.delete('/:id', authMiddleware, requireAdmin, postController.deletePost);

module.exports = router;
