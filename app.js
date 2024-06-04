//require the express
const express = require("express");
const app = express();

//ejs-mate
const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);

//custom error class 
const ExpressError = require("./utils/ExpressError.js")

//express session
const session = require("express-session");

//connect-flash
const flash =  require("connect-flash"); 

//passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//require the mongoose
const mongoose = require("mongoose");
main()
    .then((res) => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    })


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

//access the views folder
const path = require("path")
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//to parse the data  
app.use(express.urlencoded({ extended: true }));

//require the listing model
const Listing = require("./models/listing.js");

//require the routes
const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js"); 
const userRouter = require("./routes/user.js"); 

//require isLoggedIn function
const { isLoggedIn,isOwner } = require("./middleware.js");



//method-override
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//access the static files in public folder
app.use(express.static(path.join(__dirname, "/public")));


//function with session option
const sessionOptions = {
    secret:"mysupersecretecode",
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
}

//home route
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});


app.use(session(sessionOptions));
app.use(flash());

//initlize the password
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// app.get("/demouser", async (req,res)=>{
//     let fakeUser = new User({
//         email: "tushar.amale@gmail.com",
//         username: "tushar.amale"
//     });

//     let registedUser = await User.register(fakeUser, "helloworld");
//     res.send(registedUser);
// })


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


//if user entered the wrong route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found !"));
})

//error handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
    //res.status(statusCode).send(message);
});

//app.listen
let port = 8080;
app.listen(port, () => {
    console.log(`app is litening to the port ${port}`)
});
