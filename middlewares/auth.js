///Auth, isStudent, isAdmin

const jwt = require("jsonwebtoken");//load jsonwebtoken
require("dotenv").config();//load config file


exports.auth = (req, res, next) => {
    try {
        //get the JWT token detail from req body
        //other ways to fetch token
        console.log("Cookie",req.cookies.token);
        console.log("body",req.body.token);
        console.log("header",req.header("Authorization"));

        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", ""); 

        if(!token){
            return res.status(401).json({
                succes: false,
                message: "Token Missing",
            });
        }
        //varifuy the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            //store in request
            req.user = decode;
        } catch (error) {
            return res.status(401).json({
                succes: false,
                message: "Token is invalid ",
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            succes: false,
            message: "Something went Wrong while verify the token",
        });
    }
}

exports.isStudent = ( req, res, next) => {
    try {
        if(req.user.role !== "Student") {
            return res.status(401).json({
                succes: false,
                message: "This is a Protected Route For Student  ",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            succes: false,
            message: "User role is not matching ",
        });
    }
}

exports.isAdmin = ( req, res, next) => {
    try {
        if(req.user.role !== "Admin") {
            return res.status(401).json({
                succes: false,
                message: "This is a Protected Route For Admin  ",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            succes: false,
            message: "User role is not matching ",
        });
    }
}