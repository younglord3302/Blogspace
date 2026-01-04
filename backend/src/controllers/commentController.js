const Comment = require('../models/Comment');

exports.getCommentsForPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId, status: 'approved' })
      .populate('author', 'username avatarUrl')
      .sort({ createdAt: 1 });

    res.json({ comments });
  } catch (err) {
    next(err);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user.id,
      content
      // status: 'pending' by default
    });

    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
};

// Admin moderation
exports.getComments = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const comments = await Comment.find(filter)
      .populate('post', 'title slug')
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    res.json({ comments });
  } catch (err) {
    next(err);
  }
};

exports.updateCommentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const comment = await Comment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json({ comment });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Comment.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
