const mongoose = require('mongoose');

const Post = require('./post'); // Import the post model

mongoose.connect("mongodb://127.0.0.1:27017/miniproject");

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    name: String,
    age: Number,
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: "post"}]
});

module.exports = mongoose.model('user', userSchema);