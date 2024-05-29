module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        console.log(req.user);
        req.flash("error","You should logged in to add the listings");
        return res.redirect("/login");
    };
};