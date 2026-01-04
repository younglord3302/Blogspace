const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        process.env.CORS_ORIGIN || '*'
      ];
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

// Routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const tagRoutes = require('./routes/tags');
const commentRoutes = require('./routes/comments');

app.get('/', (req, res) => {
  res.json({ message: 'Basic Blog API running' });
});

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/tags', tagRoutes);
app.use('/comments', commentRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;
