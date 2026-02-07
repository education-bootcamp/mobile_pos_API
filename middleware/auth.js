const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next)=>{
    let token;

    if(req.headers.autherization && req.headers.autherization.startsWith('Bearer')){
        try{
            // Get the token from the header
            token = req.headers.autherization.split(' ')[1];

            // verify token
            const decoded= jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            next();
        }catch(error){
            console.error(error);
            res.status(401).json({success: false, message:'Not Autherized, token failed'})
        }
    }
    if(!token){
        res.status(401).json({success: false, message:'Not Autherized, no token found'})
    }
}
module.exports = {protect}