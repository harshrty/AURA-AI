const jwt = require("jsonwebtoken")


const protect = async (req , res ,next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
           //ATTACHING THE USER ID TO THE REQUEST OBJECT SO THE AI ROUTES KNOW WHO IS CHATTING
            req.user = decoded.id;
            next()

        } catch (error) {
            res.status(401).json({message : "not authorized token fail"})
        }
    } 
    if(!token) {
        res.status(401).json({message : "not authorized, no token"})
    }
   
};


module.exports = {protect};