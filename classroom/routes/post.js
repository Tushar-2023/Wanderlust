const express = require("express");

const router = express.Router();


//posts
//index route
router.get("/",(req,res)=>{
    res.send("index page shows all the posts")
})

//show route
router.get("/:id", (req,res)=>{
    res.send("shows the specific post");
});

//post route
router.post("/",(req,res)=>{
    res.send("add the new post");
})

//delete route
router.delete("/:id",(req,res)=>{
    res.send("deleting the post");
})

module.exports = router;
