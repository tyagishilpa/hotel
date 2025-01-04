const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req,res,next)=>{

   //first check headers has authorization or not
    const authorization = req.headers.authorization
    if(!authorization) return res.status(401).json({error: 'invalid token'});

    //extract the jwt token from request headers
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error:'unauthorized'});

    try{
     //verify jwt token
    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    //attach user info to req obj
    req.user = decoded
    next();
    }catch(err){
      console.error(err);
      res.status(401).json({error:'invalid token'});
    }
}


//fnction to generate jwt token
const generateToken = (userData)=>{
    //generate a new JWT token using user data
    return jwt.sign(userData,process.env.JWT_SECRET);
}

module.exports = {jwtAuthMiddleware,generateToken};