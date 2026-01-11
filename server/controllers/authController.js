const User = require("../models/user");
const bcrypt = require("bcryptjs")
const JWT = require('jsonwebtoken')


const usersignup = async (req,res) => {
    try {
    const {username,email,password} = req.body;

    if (!username || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

    const normalizedEmail = email.toLowerCase();
    const userexists = await User.findOne({$or : [{email : email.toLowerCase()}, {username}]})
    if(userexists) {
        let errorMessage;
         if(userexists.email === normalizedEmail)  {
            errorMessage = "user already exists"
         } else {
            errorMessage = "USERNAME ALREADY TAKEN "
         }

         return res.status(400).json({message : errorMessage})
    }
    


   const salt  = await bcrypt.genSalt(10);
   const HashedPassword = await bcrypt.hash(password, salt );
    ///saving new user 
   const newUser = new User({
    username,
    email : normalizedEmail,
    password : HashedPassword
   });
   await newUser.save();

   res.status(201).json({message : "user registered successfully"}) 
 } catch (error) {
    res.status(500).json({message : error.message})
   }

}

const userlogin = async(req,res) => {
    try {

    const {email,password} = req.body;

    const user = await User.findOne({email})
    if(!user) return res.status(400).json({message : "invalid username"});

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch) return res.status(400).json({message : "invalid password"})
    
    //jwt tokens 
    const token = JWT.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})
    res.json({token, user : {id:user._id, username: user.username, email:user.email}});



} catch (error) {
    res.status(500).json({message : error.message})
}
}
module.exports = {usersignup,userlogin};


