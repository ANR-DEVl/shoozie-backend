

module.exports = (roles) =>{
    return (req,res,next)=>{
        const currRole = req.currUser.role

        if(!roles.includes(currRole)){
            return res.status(403).json({status:'fail',message:`user not allowed`})
        }
        next()
    }
}




