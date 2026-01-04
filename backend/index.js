const app = require('./src/app');
const connectDB = require('./src/utils/db');

// Cache the database connection
let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  
  app(req, res);
};
