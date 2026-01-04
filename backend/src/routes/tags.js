const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const authMiddleware = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/requireAdmin');

// Public
router.get('/', tagController.getTags);

// Admin
router.post('/', authMiddleware, requireAdmin, tagController.createTag);
router.delete('/:id', authMiddleware, requireAdmin, tagController.deleteTag);

module.exports = router;
