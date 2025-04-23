const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the User schema
const userSchema = new Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        age: { type: Number, required: true },
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"  // The posts created by this user
            }
        ],
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
    },
    { timestamps: true }
);

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
