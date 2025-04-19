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

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.UPLOAD_PATH)
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

app.get("/like/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({ _id: req.params.id }).populate("user");
    if (post.likes.indexOf(req.user.userid) === -1) {
        post.likes.push(req.user.userid);
    } else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }
    await post.save();
    res.redirect("/profile");
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

function isLoggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect("/login");
    
    try {
        const data = jwt.verify(token, config.JWT_SECRET);
        req.user = data;
        next();
    } catch (err) {
        res.redirect("/login");
    }
}

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});