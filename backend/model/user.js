const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        age: { type: Number, required: true },
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post"
            }
        ],
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
