const express = require("express");
const router = express.Router();
const User = require("../models/user.js");

router.get("/signup", (req, res) => {
    res.render("./users/signup.ejs");
});

router.post("/signup", async (req, res) => {
    let { username, email, password } = req.params;
    const newUser = new User({username, email})
    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash( "success", "Welcome to WanderLust" );
    res.redirect("/listings");
});

module.exports = router;