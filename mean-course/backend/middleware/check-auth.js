const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token,"hash_secret_166552afbf222226e68edea13ce6121a");  
    } catch(err){
        res.status(401).json({
            message:'Authorization failed'
        })
    }
}