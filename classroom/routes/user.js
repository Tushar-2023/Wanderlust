const express = require("express");
const router = express.Router();




//user
//index route
router.get("/",(req,res)=>{
    res.send("get the users");
});

//show route
router.get("/:id",(req,res)=>{
    res.send("get the particular user");
});

//post route
router.post("/",(req,res)=>{
    res.send("creating new user");
});

//delete route
router.delete("/:id",(req,res)=>{
    res.send("deleting the user");
})


module.exports = router;
