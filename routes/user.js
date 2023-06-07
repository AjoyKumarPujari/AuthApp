const express = require("express"); //express instanse import
const router = express.Router(); //router import
const {login, signup} = require("../Controllers/Auth");
const {auth, isStudent, isAdmin} = require("../middlewares/auth");
router.post("/login", login);
router.post("/signup", signup);

//Testing protected Routes
router.get("/test", auth, (req, res) => {
    res.json({
        success: true,
        message:"Welcome to Protected route for Testing ",
    });
});
//protected Routes
router.get("/student", auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message:"Welcome to Protected route for students",
    });
});
//protected Routes
router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message:"Welcome to Protected route for Admin",
    });
});

module.exports = router;