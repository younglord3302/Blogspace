const Tag = require('../models/Tag');

exports.getTags = async (req, res, next) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json({ tags });
  } catch (err) {
    next(err);
  }
};

exports.createTag = async (req, res, next) => {
  try {
    const { name, slug } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const existing = await Tag.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      return res.status(409).json({ error: 'Tag already exists' });
    }

    const tag = await Tag.create({ name, slug });
    res.status(201).json({ tag });
  } catch (err) {
    next(err);
  }
};

exports.deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Tag.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
