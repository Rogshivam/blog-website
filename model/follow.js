const express = require('express');
const router = express.Router();
const Follow = require('../models/follow');
const User = require('../models/user');
const Post = require('../models/post');
const userSchema = new Schema({
    username: { type: String, required: true },
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
    followers: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []  // Ensures followers array is always initialized as an empty array
    },
    following: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []  // Ensures following array is always initialized as an empty array
    }
}, { timestamps: true });

// Middleware to check if user is logged in (optional)
const isLoggedIn = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect("/login");
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
};

// Follow a user
router.post('/follow/:id', isLoggedIn, async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.userid);

        if (!userToFollow || !currentUser) {
            return res.status(404).send("User not found");
        }

        // Check if the user is already following
        const isAlreadyFollowing = currentUser.following.includes(userToFollow._id);
        if (!isAlreadyFollowing) {
            // Add user to following and followers list
            currentUser.following.push(userToFollow._id);
            userToFollow.followers.push(currentUser._id);

            await currentUser.save();
            await userToFollow.save();
        }

        res.redirect(`/follow-page/${userToFollow._id}`);
    } catch (err) {
        console.error("Error following user:", err);
        res.status(500).send("Error following user");
    }
});

// Unfollow a user
router.post('/unfollow/:id', isLoggedIn, async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.userid);

        if (!userToUnfollow || !currentUser) {
            return res.status(404).send("User not found");
        }

        // Remove user from following and followers list
        currentUser.following.pull(userToUnfollow._id);
        userToUnfollow.followers.pull(currentUser._id);

        await currentUser.save();
        await userToUnfollow.save();

        res.redirect(`/follow-page/${userToUnfollow._id}`);
    } catch (err) {
        console.error("Error unfollowing user:", err);
        res.status(500).send("Error unfollowing user");
    }
});
// Toggle follow/unfollow
router.post('/toggle/:id', isLoggedIn, async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.userid);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const index = userToFollow.followers.indexOf(currentUser._id);
        let isFollowing = false;

        if (index === -1) {
            userToFollow.followers.push(currentUser._id);
            currentUser.following.push(userToFollow._id);
            isFollowing = true;
        } else {
            userToFollow.followers.splice(index, 1);
            currentUser.following.splice(currentUser.following.indexOf(userToFollow._id), 1);
        }

        await userToFollow.save();
        await currentUser.save();

        res.json({
            isFollowing,
            followerCount: userToFollow.followers.length
        });
    } catch (error) {
        console.error("Toggle follow error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});


module.exports = router;
