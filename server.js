
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

require('dotenv').config()

const productsRouter = require('./routes/products.route')
const ordersRouter = require('./routes/orders.route')
const usersRouter = require('./routes/users.route')




mongoose.connect(process.env.Mongo_URL)
    .then(() => {
    console.log("✅ Connected to MongoDB successfully!");}).catch((err)=>{console.log('================',err,'==========================')})

const app = express()

app.use(cors({
    origin:[
        'http://localhost:3000',
        'https://shoozie-store-ecommecre-pj67-h27eq3brf.vercel.app',
        'https://shoozie-store-ecommecre-pj67.vercel.app'
    ]
}));
// app.use(cors())

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
    message: { status: 'error', message: 'Too many requests, please try again later.' }
})

const orderLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 10, 
    message: { status: 'error', message: 'Too many orders, please try again later.' }
})




const PORT = process.env.PORT ||5000

app.use(express.json());

app.use('/api/', generalLimiter)

app.use('/api/products',productsRouter);
app.use('/api/orders',ordersRouter);
app.use('/api/users',usersRouter);

// app.all('*',(req,res,next)=>{
//     res.status(404).json({status:'error',message:'not available'})
// })



app.listen(PORT, () => {
    console.log('Server is running on port ');
});



