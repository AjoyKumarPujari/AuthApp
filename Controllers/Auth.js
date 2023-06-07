const bcrypt =  require("bcrypt");
const User = require("../model/User"); 
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async (req, res)=> {
    try {
        //get data from req body
        const {name, email, password, role} = req.body;
        //if user already exists 
        const existingUser =await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User Already Exists ",
            });
        }

        //secure Password 
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10 );

        } catch (error) {
            return res.status(500).json({
                success: false,
                message:"Error inn hashing Password",
            });
        } 
        
        //create entry for user
        const user = await User.create({
            name, email, password: hashedPassword, role
        })
        return res.status(200).json({
            success:true,
            message: "User Created Successfully"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered, please try again later",
        });
    }
}


//login
exports.login = async (req, res) => {
    try {
        //fetch data from res.body
        const {email, password} = req.body;
        //validation email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details Carefully",

            });
        }
        //user available or not
        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not available ! please singup first",

            });
        }
        //make payload
        const payload = {
            email: user.email,
            id:user._id,
            role:user.role,
        };
        //varify password & generate JWT TOKEN
        if(await bcrypt.compare(password, user.password)){
            //password match
            //create json web token
            let token = jwt.sign(payload,
                                 process.env.JWT_SECRET,
                                {
                                    expiresIn: "2h"
                                });
            
            //send the token in cookie
            user = user.toObject();
            user.token = token;          
            user.password =undefined;
            //create a cookie
            const options = {
                expiresIn: new Date(Date.now() + 3000),
                httpOnly: true,   
            }
             res.cookie("token", token, options).status(200).json({
                 success: true,
                 token,
                 user,
                 message:"User Logged in Successfully",
             });
            // res.status(200).json({
            //     success: true,
            //     token,
            //     user,
            //     message:"User Logged in Successfully",
            // });
        }else{
            return res.status(402).json({
                success:false,
                message:"Please enter a valid Password",

            });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Login Falure",
        });
    }
}