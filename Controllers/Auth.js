const bcrypt =  require("bcrypt");
const User = require("../model/User"); 

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