
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Post schema
const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",  // The user who created the post
            required: true
        },
        content: { type: String, required: true },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"  // Users who liked the post
            }
        ]
    },
    { timestamps: true }
);

// Create the Post model from the schema
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
