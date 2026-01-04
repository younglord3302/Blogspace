const Post = require('../models/Post');
const Tag = require('../models/Tag');

exports.getPosts = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, tag, search } = req.query;
    page = Number(page);
    limit = Number(limit);

    const filter = { published: true };

    if (tag) {
      const tagDoc = await Tag.findOne({ slug: tag });
      if (tagDoc) filter.tags = tagDoc._id;
      else filter.tags = null; // returns empty
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const [items, totalItems] = await Promise.all([
      Post.find(filter)
        .populate('author', 'username avatarUrl')
        .populate('tags', 'name slug')
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Post.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalItems / limit) || 1;

    res.json({
      data: items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug, published: true })
      .populate('author', 'username avatarUrl bio')
      .populate('tags', 'name slug');

    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ post });
  } catch (err) {
    next(err);
  }
};

// Admin/author only
exports.createPost = async (req, res, next) => {
  try {
    const { title, slug, content, tags = [], published } = req.body;
    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Title, slug and content are required' });
    }

    const existing = await Post.findOne({ slug });
    if (existing) {
      return res.status(409).json({ error: 'Slug already exists' });
    }

    const post = await Post.create({
      title,
      slug,
      content,
      author: req.user.id,
      tags,
      published: !!published,
      publishedAt: published ? new Date() : null
    });

    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, slug, content, tags, published } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.title = title ?? post.title;
    post.slug = slug ?? post.slug;
    post.content = content ?? post.content;
    post.tags = tags ?? post.tags;

    if (typeof published === 'boolean') {
      if (!post.published && published) {
        post.publishedAt = new Date();
      }
      post.published = published;
    }

    await post.save();
    res.json({ post });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
