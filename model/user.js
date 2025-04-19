const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    name: String,
    age: Number,
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: "post"}]
});

module.exports = mongoose.model('user', userSchema);