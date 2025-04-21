require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/miniproject',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    UPLOAD_PATH: './public/images/uploads'
}; 