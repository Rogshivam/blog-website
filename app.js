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

// Basic Express setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Set the views directory
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // Set the public directory

// Public Posts Route - Moved outside init()
app.get('/public-posts', isLoggedIn, async (req, res) => {
    try {
        console.log('Accessing public-posts route');
        const searchQuery = req.query.search || '';
        let query = {};
        
        if (searchQuery) {
            // Find users whose name matches the search query
            const users = await userModel.find({ 
                name: { $regex: searchQuery, $options: 'i' } 
            });
            const userIds = users.map(user => user._id);
            query = { user: { $in: userIds } };
        }

        const posts = await postModel.find(query)
            .populate('user')
            .sort({ createdAt: -1 });
        
        const currentUser = await userModel.findOne({ _id: req.user.userid });
        
        if (!currentUser) {
            console.log('No current user found, redirecting to login');
            return res.redirect('/login');
        }

        console.log(`Rendering public-posts with ${posts.length} posts for user: ${currentUser.username}`);
        res.render("public-posts", { 
            posts, 
            currentUser,
            title: "Public Blog",
            error: null,
            searchQuery: searchQuery
        });
    } catch (error) {
        console.error('Error in public-posts route:', error);
        res.status(500).render("public-posts", {
            posts: [],
            currentUser: null,
            title: "Error",
            error: "An error occurred while loading posts",
            searchQuery: req.query.search || ''
        });
    }
});

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

// Middleware
function isLoggedIn(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            console.log('No token found, redirecting to login');
            return res.redirect("/login");
        }
        
        const data = jwt.verify(token, config.JWT_SECRET);
        req.user = data;
        console.log('User authenticated:', data.email);
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        res.clearCookie("token");
        res.redirect("/login");
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

        // Routes
        app.get('/', (req, res) => {
            res.render("index");
        });

        app.get("/test", (req, res) => {
            res.render("test");
        });

        app.get('/login', (req, res) => {
            res.render("login");
        });

        app.get('/register', (req, res) => {
            res.render("register");
        });

        app.get('/profile', isLoggedIn, async (req, res) => {
            let user = await userModel.findOne({ _id: req.user.userid }).populate("posts");
            res.render("profile", { user });
        });

        app.get('/test-public-posts', async (req, res) => {
            try {
                console.log('Accessing test-public-posts route');
                const searchQuery = req.query.search || '';
                const posts = await postModel.find().populate('user').sort({ createdAt: -1 });
                console.log(`Found ${posts.length} posts`);
                res.render("public-posts", { 
                    posts, 
                    currentUser: null,
                    title: "Public Blog",
                    error: null,
                    searchQuery: searchQuery
                });
            } catch (error) {
                console.error('Error in test-public-posts route:', error);
                res.status(500).send('Internal Server Error');
            }
        });

        app.get("/like/:id", isLoggedIn, async (req, res) => {
            let post = await postModel.findOne({ _id: req.params.id }).populate("user");
            if (post.likes.indexOf(req.user.userid) === -1) {
                post.likes.push(req.user.userid);
            } else {
                post.likes.splice(post.likes.indexOf(req.user.userid), 1);
            }
            await post.save();
            res.redirect(req.headers.referer || "/profile");
        });

        app.get("/edit/:id", isLoggedIn, async (req, res) => {
            let post = await postModel.findOne({ _id: req.params.id }).populate("user");
            res.render("edit", { post });
        });

        app.post("/update/:id", isLoggedIn, async (req, res) => {
            await postModel.findOneAndUpdate({ _id: req.params.id }, { content: req.body.content });
            res.redirect("/profile");
        });

        app.post("/post", isLoggedIn, async (req, res) => {
            let user = await userModel.findOne({ email: req.user.email });
            let { content } = req.body;

            let post = await postModel.create({
                user: user._id,
                content
            });

            user.posts.push(post._id);
            await user.save();
            res.redirect("/profile");
        });

        app.post("/public-post", isLoggedIn, async (req, res) => {
            let user = await userModel.findOne({ email: req.user.email });
            let { content } = req.body;

            let post = await postModel.create({
                user: user._id,
                content
            });

            user.posts.push(post._id);
            await user.save();
            res.redirect("/public-posts");
        });

        app.post("/register", async (req, res) => {
            let { email, password, username, name, age } = req.body;
            let user = await userModel.findOne({ email });
            if (user) return res.status(500).send("User already registered");

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, async (err, hash) => {
                    let user = await userModel.create({
                        username,
                        email,
                        age,
                        name,
                        password: hash
                    });
                    let token = jwt.sign({ email: email, userid: user._id }, config.JWT_SECRET);
                    res.cookie("token", token);
                    res.redirect("/profile");
                });
            });
        });

        app.post('/login', async (req, res) => {
            let { email, password } = req.body;
            let user = await userModel.findOne({ email });
            if (!user) return res.status(500).send("Invalid credentials");

            bcrypt.compare(password, user.password, function (err, result) {
                if (result) {
                    let token = jwt.sign({ email: email, userid: user._id }, config.JWT_SECRET);
                    res.cookie("token", token);
                    res.redirect("/profile");
                } else {
                    res.redirect("/login");
                }
            });
        });

        app.get('/logout', (req, res) => {
            res.clearCookie("token");
            res.redirect("/login");
        });

        app.listen(config.PORT, () => {
            console.log(`Server is running on http://localhost:${config.PORT}`);
            console.log('Press Ctrl+C to stop the server');
        });
    } catch (error) {
        console.error('Failed to initialize application:', error);
        process.exit(1);
    }
}

init().catch(err => {
    console.error('Fatal error during initialization:', err);
    process.exit(1);
});