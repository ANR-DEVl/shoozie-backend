
const Order = require('../models/orders')
const Product = require('../models/products')





async function getAllOrders(req,res){
    try{
        const limit = Number(req.query.limit);
        const page = Number(req.query.page);
        const skip = (page-1)*limit;

        const ordersList = await Order.find()
            .sort({'orderData.date':-1})
            .skip(skip)
            .limit(limit)

        res.status(200).json({status:'success',data:{orders:ordersList}})



    }catch(err){
        res.status(500).json({status:'error',message:err.message})
    }

}


async function getAllTitles(req,res){
    try{
        const limit = Number(req.query.limit);
        const page = Number(req.query.page);
        const skip = (page-1)*limit;

        const ordersList = await Order.find({},'_id orderData.status clientData.fullName')
            .sort({'orderData.date':-1})
            .skip(skip)
            .limit(limit)

            console.log(ordersList)

        res.status(200).json({status:'success',data:{orders:ordersList}})



    }catch(err){
        res.status(500).json({status:'erroruuuuu',message:err.message})
    }

}





async function getOrder(req,res){
    try{

        const id = req.params.id;
        const selectedOrder = await Order.findById(id)
        if(!selectedOrder){
            return(
                res.status(404).json({status:'fail',data:{message:"order not found"}})
            )
        }

        res.status(200).json({status:'success',data:{order:selectedOrder}});




    }catch(err){
        res.status(500).json({status:'error',message:err.message})
    }

}









async function addOrder(req,res){
    try{
        const orderInfo = req.body;

        const newOrder = new Order(orderInfo);
        let totalPrice = 0;


//order verification

for(const item of orderInfo.orderData.products){

    if(item.quantity <= 0){
        return res.status(400).json({status:'fail',message:`(${item.name}) false quantity`})
    }


    const selectedProduct =await Product.findById(item.productId)

    if(!selectedProduct){
        return res.status(404).json({
            status:'fail',
            message:'Product not found'
    })
}

    for(let s of selectedProduct.size){
        if(s.value ==item.properties.size){
            if(s.stock < item.quantity){
                return res.status(400).json({status:'fail',message:`(Insufficient ${item.name}) stock`})
            }


        }

    }



}




//updating DB:

//---------total calculation
//list of ordered id's



for(const item of orderInfo.orderData.products){




    // const product = await Product.findById(item.productId);

//    await Product.findByIdAndUpdate(item.productId,{$inc:{sells:item.quantity}})

    const selectedProduct =await Product.findById(item.productId)



    selectedProduct.sells += item.quantity

    for(let s of selectedProduct.size){
        if(s.value ==item.properties.size){

            s.stock -= item.quantity;

        }

    }

    await selectedProduct.save()

    totalPrice += selectedProduct.price * item.quantity;

}


        newOrder.orderData.total = totalPrice;

        await newOrder.save()


        res.status(201).json({status:'success',data:{newOrder}})


    }catch(err){
        res.status(500).json({status:'error',message:err.message})
    }

}










async function deleteOrder(req,res){
    try{
        const id = req.params.id;

        const deletedOrder = await Order.findByIdAndDelete(id)
        if(!deletedOrder){
            res.status(404).json({status:'fail',data:{message:"order not found"}})
        }

        res.status(200).json({status:'success',data:{message:'order deleted'}});




    }catch(err){
        res.status(500).json({status:'error',message:err.message})
    }

}


async function updateStatus(req,res){
    try{
        const id = req.params.id;
        const status = req.query.status;

        const updatedOrder = await Order.findByIdAndUpdate(id,
            {$set:{'orderData.status':status}},{new:true}
        )
        if(!updatedOrder){
            res.status(404).json({status:'fail',data:{message:"order not found"}})
        }

        res.status(200).json({status:'success',data:{order:updatedOrder}});




    }catch(err){
        res.status(500).json({status:'error',message:err.message})
    }

}


module.exports = {getAllOrders,getOrder,addOrder,deleteOrder,getAllTitles,updateStatus};