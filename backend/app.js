const express = require('express');
const app = express();
const userModel = require("./model/user");
const postModel = require("./model/post");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");
const config = require('./config');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const Post = require('./model/post'); // adjust path if needed



// Security middleware
app.use(helmet());

// Allow requests from your frontend origin (React app on port 3000)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Basic Express setup
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS setup for frontend communication
app.use(cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// API Routes
app.get('/api/profile', isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.user.userid })
            .populate({
                path: "posts",
                options: { sort: { createdAt: -1 } }
            })
            .populate("followers", "name username")
            .populate("following", "name username");
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.json({ user });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: "Failed to load profile" });
    }
});

app.get('/api/posts', isLoggedIn, async (req, res) => {
    try {
        const posts = await Post.find();
        const user = await userModel.findOne({ _id: req.user.userid })
            .populate({
                path: "posts",
                options: { sort: { createdAt: -1 } }
            })
            .populate("followers", "name username")
            .populate("following", "name username");
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.json({ user });
    } catch (error) {
        console.error('Posts error:', error);
        res.status(500).json({ error: "Failed to load posts" });
    }
});

app.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  
  if (!id || id === 'undefined') {
    return res.status(400).json({ error: 'Post ID is required and must be valid' });
  }

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error('Get post error:', err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});


app.put('/api/posts/:id', isLoggedIn, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        
        // Check if user owns the post
        if (post.user.toString() !== req.user.userid) {
            return res.status(403).json({ error: "Not authorized to edit this post" });
        }
        
        post.content = req.body.content;
        await post.save();
        res.json({ message: "Post updated successfully" });
    } catch (error) {
        console.error('Update post error:', error);
        res.status(500).json({ error: "Failed to update post" });
    }
});

app.delete('/api/posts/:id', isLoggedIn, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        
        // Check if user owns the post
        if (post.user.toString() !== req.user.userid) {
            return res.status(403).json({ error: "Not authorized to delete this post" });
        }
        
        await postModel.findByIdAndDelete(req.params.id);
        
        // Remove post from user's posts array
        await userModel.findByIdAndUpdate(req.user.userid, {
            $pull: { posts: req.params.id }
        });
        
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ error: "Failed to delete post" });
    }
});

// app.post('/api/posts', isLoggedIn, async (req, res) => {
//     try {
//         const newPost = new postModel({
//             content: req.body.content,
//             user: req.user.userid
//         });
//         await newPost.save();
        
//         // Update user's posts array
//         const user = await userModel.findById(req.user.userid)
//             .populate({
//                 path: "posts",
//                 options: { sort: { createdAt: -1 } }
//             })
//             .populate("followers", "name username")
//             .populate("following", "name username");
        
//         user.posts.push(newPost._id);
//         await user.save();
        
//         res.json({ user });
//     } catch (error) {
//         console.error('Create post error:', error);
//         res.status(500).json({ error: "Failed to create post" });
//     }
// });
app.post('/api/posts', isLoggedIn, async (req, res) => {
  try {
    const newPost = new postModel({
      content: req.body.content,
      user: req.user.userid,
    });

    await newPost.save();

    // Add post to user's posts array
    await userModel.findByIdAndUpdate(req.user.userid, {
      $push: { posts: newPost._id },
    });

    // Optionally populate user field in post
    const populatedPost = await newPost.populate('user', 'name username');

    res.status(201).json(populatedPost); // ✅ Send back the new post
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
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
            .populate('user', 'name username')
            .sort({ createdAt: -1 });
        
        res.json({ posts });
    } catch (error) {
        console.error('Public posts error:', error);
        res.status(500).json({ error: "Failed to load posts" });
    }
});

app.get('/api/users/:id', isLoggedIn, async (req, res) => {
    try {
        const profileUser = await userModel.findById(req.params.id)
            .populate({
                path: "posts",
                options: { sort: { createdAt: -1 } }
            })
            .populate("followers", "name username")
            .populate("following", "name username");
        
        const currentUser = await userModel.findById(req.user.userid);

        if (!profileUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const isFollowing = profileUser.followers && 
            profileUser.followers.some(follower => follower._id.toString() === currentUser._id.toString());

        res.json({
            user: profileUser,
            currentUser,
            isFollowing
        });
    } catch (error) {
        console.error('User profile error:', error);
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

        if (userToFollow._id.toString() === currentUser._id.toString()) {
            return res.status(400).json({ error: "Cannot follow yourself" });
        }

        if (!Array.isArray(userToFollow.followers)) {
            userToFollow.followers = [];
        }
        if (!Array.isArray(currentUser.following)) {
            currentUser.following = [];
        }

        const isFollowing = userToFollow.followers.includes(currentUser._id);
        let newStatus = false;

        if (!isFollowing) {
            userToFollow.followers.push(currentUser._id);
            currentUser.following.push(userToFollow._id);
            newStatus = true;
        } else {
            userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== currentUser._id.toString());
            currentUser.following = currentUser.following.filter(id => id.toString() !== userToFollow._id.toString());
        }

        await userToFollow.save();
        await currentUser.save();

        res.json({
            isFollowing: newStatus,
            followerCount: userToFollow.followers.length
        });
    } catch (error) {
        console.error('Toggle follow error:', error);
        res.status(500).json({ error: "Failed to toggle follow" });
    }
});

// Auth Routes
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const token = jwt.sign(
            { userid: user._id, email: user.email }, 
            config.JWT_SECRET, 
            { expiresIn: '10m' }
        );
        
        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 10 * 60 * 1000 // 10 minutes
        });
        
        res.json({ 
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Login failed" });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password, name, age } = req.body;
        
        if (!username || !email || !password || !name || !age) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const existingUser = await userModel.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 12);
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
        console.error('Register error:', error);
        res.status(500).json({ message: "Registration failed" });
    }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Logout successful" });
});

app.post('/api/refresh-token', isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userid);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        
        const newToken = jwt.sign(
            { userid: user._id, email: user.email }, 
            config.JWT_SECRET, 
            { expiresIn: '10m' }
        );
        
        res.cookie('token', newToken, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 10 * 60 * 1000 // 10 minutes
        });
        
        res.json({ message: "Token refreshed" });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ error: "Failed to refresh token" });
    }
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
        console.error('Auth error:', err);
        res.status(401).json({ error: "Invalid token" });
    }
}

// Connect to MongoDB
async function connectDB() {
    try {
        console.log('Attempting to connect to MongoDB at:', config.MONGODB_URI);
        await mongoose.connect(config.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
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