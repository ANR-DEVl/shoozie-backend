
const mongoose = require('mongoose');

const Schema = mongoose.Schema;



const usersSchema = new Schema({
    fullName:{type:String,required:true},
    password:{type:String,required:true},
    phone:{type:String,required:true,unique:true},
    userLocation:{
            city:{type:String,required:true},
            commune:{type:String,required:true}
            },
    opt2:{type:String},
    ordersId :[{type:Schema.Types.ObjectId,ref:"Order"}],
    role:{type:String,default:'client',enum:['client','admin']}
    
})


const User = mongoose.model('User',usersSchema);

module.exports = User


