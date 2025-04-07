const express = require ('express');
const app = express();
const userModel = require("./model/user");
const postModel = require("./model/post");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const path = require("path");
const multer = require("multer");

app.set("view engine" ,"ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, bytes){
            const fn = bytes.toString("hex") + path.extname(file.orignalname)
            cb(null, fn)
    })
    }
  })
  
  const upload = multer({ storage: storage })


app.get('/', (req, res) => {
    res.render("index");
});
app.get("/test", (req, res) => {
    res.render("test");
});
// app.get("/upload", upload.single("image") (req, res) => {
    
// });
app.get('/login', (req, res) => {
    res.render("profile");
});
app.get('/profile', isLoggedIn,async (req, res) => {
    let user = await userModel.findOne({_id: req.params .id}).populate("posts")
    res.render("profile", {user});
});

app.get("/like/:id", isLoggedIn,async (req, res) => {
    let post = await postModel.findOne({_id: req.params.id}).populate("user");
    if(post.likes.indexOf(req.user.userid) === -1){
        post.like.push(req.user.userid);
    }
    else{
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }
    await post.save();
    res.render("profile", {user});
});
app.get("/edit/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({_id: req.params.id}).populate("user");
    res.redirect("/profile");
});
app.get("/update/:id", isLoggedIn,async (req, res) => {
    let post = await postModel.findOneAndUpdate({_id: req.params.id}, {content: req.body.content})
    res.render("edit",{post})
});
app.post("/post", isLoggedIn,async (req, res) => {
    let user = await userModel.findOne({email: req.user.email});
    let {content} = req.body;

    let post = await postModel.create({
        user: user._id,
        content
    });

    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
});
app.post('/register', async  (req, res) => {
    let {email, password, username, name, age} = req.body;
    let user = await  userModel.findOne({email});   
    if(user) return res.status(500).send("user alresdy registered");

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                let user = await userModel.create({
                    username,
                    email,
                    age,
                    name,
                    password: hash
                });
            let token = jwt.sign({email: email, userid: user._id},"shhhh");
            res.cookie("token", token);
            })
        })
});
app.post('/login', async  (req, res) => {
    let {email, password} = req.body;

    let user = await  userModel.findOne({email});   
    if(!user) return res.status(500).send("Something went wrong");

    bcrypt.compare(password,user.password, function (err, result)  {
            if(result) {
                let token = jwt.sign({email: email, userid: user._id},"shhh");
                res.cookie("token", token);
                res.status(200).redirect("/profile");
            } else res.redirect("/login");
    });
});

app.get('/logout',(req, res) =>{
    res.cookie("token", "");
    res.redirect("/login");
});

function isLoggedIn(req, res, next){
    if(req.cookies.token ==="") res.redirect("/login");
    else{
        let data = jwt.verify(req.cookies.token, "shhhh");
        req.user = data;
        next();
    }
    
}
// function isLoggedIn(req, res, next) {
//     const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
//     if (!token) {
//         return res.status(401).send('Access Denied: No Token Provided');
//     }
//     try {
//         const verified = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = verified;
//         next();
//     } catch (err) {
//         res.status(400).send('Invalid Token');
//     }
// }

app.listen(3000);