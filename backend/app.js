const express = require('express');
const app = express();
const userModel = require("./model/user");
const postModel = require("./model/post");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const config = require('./config');
const mongoose = require('mongoose');
const cors = require('cors');

// Basic Express setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS setup for frontend communication
app.use(cors({
    origin: config.CORS_ORIGIN,
    credentials: true
}));

// API Routes
app.get('/api/profile', isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ _id: req.user.userid }).populate("posts");
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: "Failed to load profile" });
    }
});

app.get('/api/posts/:id', isLoggedIn, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        res.json({ content: post.content });
    } catch (error) {
        res.status(500).json({ error: "Failed to load post" });
    }
});

app.put('/api/posts/:id', isLoggedIn, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        post.content = req.body.content;
        await post.save();
        res.json({ message: "Post updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update post" });
    }
});

app.post('/api/posts', isLoggedIn, async (req, res) => {
    try {
        const newPost = new postModel({
            content: req.body.content,
            user: req.user.userid
        });
        await newPost.save();
        
        // Update user's posts array
        const user = await userModel.findById(req.user.userid).populate("posts");
        user.posts.push(newPost._id);
        await user.save();
        
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: "Failed to create post" });
    }
});

app.get('/api/public-posts', isLoggedIn, async (req, res) => {
    try {
        const searchQuery = req.query.search || '';
        let query = {};
        
        if (searchQuery) {
            const users = await userModel.find({ 
                name: { $regex: searchQuery, $options: 'i' } 
            });
            const userIds = users.map(user => user._id);
            
            query = {
                $or: [
                    { user: { $in: userIds } },
                    { content: { $regex: searchQuery, $options: 'i' } }
                ]
            };
        }

        const posts = await postModel.find(query)
            .populate('user')
            .sort({ createdAt: -1 });
        
        res.json({ posts });
    } catch (error) {
        res.status(500).json({ error: "Failed to load posts" });
    }
});

app.get('/api/users/:id', isLoggedIn, async (req, res) => {
    try {
        const profileUser = await userModel.findById(req.params.id).populate("posts");
        const currentUser = await userModel.findById(req.user.userid);

        if (!profileUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const isFollowing = profileUser.followers && profileUser.followers.includes(currentUser._id);

        res.json({
            user: profileUser,
            currentUser,
            isFollowing
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to load user profile" });
    }
});

app.post('/api/toggle-follow/:id', isLoggedIn, async (req, res) => {
    try {
        const userToFollow = await userModel.findById(req.params.id);
        const currentUser = await userModel.findById(req.user.userid);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!Array.isArray(userToFollow.followers)) {
            userToFollow.followers = [];
        }
        if (!Array.isArray(currentUser.following)) {
            currentUser.following = [];
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
        res.status(500).json({ error: "Failed to toggle follow" });
    }
});

// Auth Routes
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const token = jwt.sign({ userid: user._id, email: user.email }, config.JWT_SECRET, { expiresIn: '24h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
});

app.post('/register', async (req, res) => {
    try {
        const { username, email, password, name, age } = req.body;
        
        const existingUser = await userModel.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            username,
            email,
            password: hashedPassword,
            name,
            age
        });
        
        await newUser.save();
        res.json({ message: "Registration successful" });
    } catch (error) {
        res.status(500).json({ message: "Registration failed" });
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Logout successful" });
});

// Middleware
function isLoggedIn(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "No token found" });
        }
        
        const data = jwt.verify(token, config.JWT_SECRET);
        req.user = data;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
}

// Connect to MongoDB
async function connectDB() {
    try {
        console.log('Attempting to connect to MongoDB at:', config.MONGODB_URI);
        await mongoose.connect(config.MONGODB_URI);
        console.log('Successfully connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        console.error('Please make sure MongoDB is installed and running on your system');
        process.exit(1);
    }
}

// Initialize the application
async function init() {
    try {
        await connectDB();
        
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, path.join(__dirname, config.UPLOAD_PATH))
            },
            filename: function (req, file, cb) {
                crypto.randomBytes(12, function (err, bytes) {
                    const fn = bytes.toString("hex") + path.extname(file.originalname);
                    cb(null, fn);
                });
            }
        });

        const upload = multer({ storage: storage });

        app.listen(config.PORT, () => {
            console.log(`Server running on port ${config.PORT}`);
        });
    } catch (error) {
        console.error('Failed to initialize server:', error);
        process.exit(1);
    }
}

init();