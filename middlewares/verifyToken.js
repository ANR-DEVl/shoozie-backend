const jwt = require('jsonwebtoken');


module.exports = (req,res,next)=>{
    const authheader = req.headers.authorization

    if(!authheader||!authheader.startsWith('Bearer ')){
        return res.status(401).json({status:'fail',message:`no Token provided`});
    }
    const token = authheader.split(' ')[1];
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        req.currUser = decoded

        next()

    }catch(err){
        return res.status(401).json({status:'error',message:'invalid Token'})
    }
}




