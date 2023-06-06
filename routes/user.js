const express = require("express"); //express instanse import
const router = express.Router(); //router import

const {login, signup} = require("../Controllers/Auth");

router.post("/login", login);
router.post("/signup", signup);

module.exports = router;