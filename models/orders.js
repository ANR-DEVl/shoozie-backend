

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ordersSchema = new Schema({
    clientData:{
        fullName:{type:String,required:true},
        phone:{type:String,required:true},
        location:{
            city:{type:String,required:true},
            commune:{type:String,required:true},
            postCode:{type:String,required:true},
        },
        opt2:String,
    },
    orderData:{
        products:[{
            name:{type:String,required:true},
            productId:{type:Schema.Types.ObjectId,ref:"Product",required:true},
            quantity:{type:Number,required:true},
            price:Number,
            properties:{
            size:String,
            color:String
            },

        }],
        total:{type:Number,required:true},
        status:{type:String,default:'pending',enum:['pending','confirmed','shipped','done','canceled']},
        date:{type:Date,default:Date.now},

    }

})





const Order = mongoose.model('Order',ordersSchema)

module.exports = Order