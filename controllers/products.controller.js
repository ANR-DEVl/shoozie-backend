

const Product = require('../models/products')


async function getAllProducts(req,res){



    try{




        const limit = Number(req.query.limit);
        const page = Number(req.query.page);
        const skip = (page-1)*limit;


    const productsData = await Product.find({},{color:0,highlights:0,brand:0,category:0})
        .skip(skip)
        .limit(limit)



    res.status(200).json({status:'success',
        data:{products:productsData}
    })
        }catch(err){
        res.status(500).json({status:'error',message:err.message})
    }

}


async function addProduct(req,res){
    try{
    const newProduct = new Product(req.body);
    await newProduct.save()

    res.status(201).json({status:'success',
        data:{product:newProduct}
    })

    }catch(err){
        res.status(500).json({status:'error',message:err.message})
    }
}



async function getProduct(req,res){

    try{
    const id = req.params.id;
    const selectedProduct = await Product.findById(id);
    if(!selectedProduct){
        return(
            res.status(404).json({status:'fail',data:{message:"product not found"}})
        )
    }

    res.status(200).json({status:'success',data:{product:selectedProduct}})

    }catch(err){
        res.status(500).json({status:'error',message:err.message})
    }
}


async function deleteProduct(req,res){


    try{
    const id = req.params.id;




    const deletedProduct = await Product.findByIdAndDelete(id);
        if(!deleteProduct){
        return(
            res.status(404).json({status:'fail',data:{message:"product not found"}})

        )
    }


    res.status(200).json({status:'success',data:{message:'product deleted'}})

    }catch(err){
        res.status(500).json({status:'error',message:err.message})
    }
}


async function editProduct(req,res){

    try{
    const id = req.params.id;





        const editedProduct = await Product.findByIdAndUpdate(id,{$set:{...req.body}},{new:true})
                if(!editedProduct){
        return(
            res.status(404).json({status:'fail',data:{message:"product not found"}})
        )
    }
    res.status(200).json({status:'success',data:{product:editedProduct}})


    }catch(err){
        res.status(500).json({status:'error',message:err.message})
    }
}



module.exports = {getAllProducts,getProduct,addProduct,deleteProduct,editProduct}