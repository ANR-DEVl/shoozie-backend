
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productsSchema = new Schema({
    name:{type:String,required:true,unique:true},
    description:{type:String,required:true},
    price:Number,
    size:[{value:String,stock:{type:Number,required:true}}],
    images:{type:[String]},
    category:String,
    brand:String,
    color:[String],
    highlights:[String],
    rate:{type:Number,enum:[0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5],default:4},
    sells:{type:Number,default:0}

})




const Product = mongoose.model('Product',productsSchema)

module.exports = Product