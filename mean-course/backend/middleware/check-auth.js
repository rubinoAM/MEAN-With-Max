const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token,config.secretHash);  
        next();
    } catch(err){
        res.status(401).json({
            message:'Authorization failed'
        })
    }
}