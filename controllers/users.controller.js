
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const { body } = require('express-validator');
const User = require('../models/users');







async function getAllUsers(req,res){

    try{

        const usersList = await User.find({},{password:0});

        res.status(200).json({status:'success',data:{users:usersList}});

    }catch(err){
        res.status(500).json({status:'error',message:err.message})
    }
}





async function register(req,res){

    try{

        const {fullName,phone,userLocation,password,opt2}= req.body;

        //verifying

        if(!fullName||!phone||!userLocation||!password){
            return res.status(400).json({status:'fail',message:'unvalid user data'})
        }

        const existingUser = await User.findOne({phone});
        if(existingUser){
            return res.status(400).json({status:'fail',message:`${phone} already used`});
        }


        const hashedPass = await bcrypt.hash(password,8);

        const newUser = new User({
            fullName,
            phone,
            userLocation,
            opt2,
            password:hashedPass
        });

        await newUser.save();

        //log in:
            const payload = {
            role:newUser.role,
            userId:newUser._id
        };

        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'15d'})


        res.status(201).json({status:'success',data:{message:"account created successfuly",user:{
            fullName:newUser.fullName,
            phone:newUser.phone,
            userLocation:newUser.userLocation,
            opt2:newUser.opt2,
            ordersId:newUser.ordersId
        },
        token}
    })


    }catch(err){
        res.status(500).json({status:'error',message:err.message})
    }
}




async function login(req,res){

    try{
        
        const {phone,password}= req.body;

        const user = await User.findOne({phone});

        if(!user){
            return res.status(401).json({status:'fail',message:`wrong phone number`});
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(401).json({status:'fail',message:`incorrect password`});
        }

        const payload = {
            role:user.role,
            userId:user._id

        };

        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'15d'})

        res.status(200).json({status:'success',data:{
            user:{            
            fullName:user.fullName,
            phone:user.phone,
            userLocation:user.userLocation,
            opt2:user.opt2,
            ordersId:user.ordersId,
            role:user.role
        }
            ,token}})




    }catch(err){
        res.status(500).json({status:'error',message:err.message})
    }
}

module.exports = {register,login,getAllUsers}

