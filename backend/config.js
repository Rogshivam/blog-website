require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/blog_website',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    UPLOAD_PATH: './public/images/uploads',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000'
}; 