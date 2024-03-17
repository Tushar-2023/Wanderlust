const express = require("express")
const app = express();
const session = require("express-session");
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true
}

app.use(session(sessionOptions));
app.use(flash());

//middleware to showcase the flash messages 
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    if (name === "anonymous") {
        req.flash("error", "user not registered");
    } else {
        req.flash("success", "user registered successfully!");
    }
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
      res.render("page.ejs", { name: req.session.name });
});

//explore the session option
// app.get("/reqcount", (req, res) => {
//     if (req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }

//     res.send(`you sent a request ${req.session.count} times`);
// })


// app.get("/test",(req,res)=>{
//     res.send("test successful!")
// })



app.use("/users", users);
app.use("/posts", posts);


app.listen(3000, () => {
    console.log("server is listening to the port 3000");
});


app.get("/", (req, res) => {
    console.dir(req.cookies);
    res.send("Hi, I am root");
});


app.get("/greet", (req, res) => {
    let { name = "Anonymous" } = req.cookies;
    res.send(`Hi, ${name}`);
});






// app.get("/getsignedcookie", (req,res)=>{
//     res. cookie("color","red",{signed:true});
//     res.send("cookie parser sent");
// });
// const cookieParser = require("cookie-parser");
// app.use(cookieParser("secretcookie"));
// //verify kaise kre ki signed cookies hai krke
// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("Verified");
// })
// app.get("/getcookies", (req,res)=>{
//     res.cookie("greet","Namaste");
//     res.cookie("madeIn","India");
//     res.send("sent you some cookies");
// })


