

const Product = require('../models/products')


async function getAllProducts(req, res) {
    try {
        const search = req.query.search;
        const limit = Number(req.query.limit) || 50;
        const page = Number(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const sort = req.query.sort || 'latest';


        const categoriesParam = req.query.categories;
        const brandParam = req.query.brand;
        const sizeParam = req.query.size;
        const priceParam = req.query.price;

        let query = {};

        // ✅ Search
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
            ];
        }

        // ✅ Categories
        if (categoriesParam) {
            const categoriesArray = categoriesParam.split(',')
            query.category = { $in: categoriesArray }
        }

        // ✅ Brand
        if (brandParam) {
            const brandArray = brandParam.split(',')
            query.brand = { $in: brandArray }
        }

        // ✅ Size
        if (sizeParam) {
            const sizeArray = sizeParam.split(',').map(Number)
            query['size.value'] = { $in: sizeArray }
        }

        // ✅ Price
        if (priceParam) {
            const priceArray = priceParam.split(',')
            const priceConditions = priceArray.map(range => {
                switch (range) {
                    case '0-50':   return { price: { $gte: 0, $lte: 50 } }
                    case '50-100': return { price: { $gte: 50, $lte: 100 } }
                    case '100-200':return { price: { $gte: 100, $lte: 200 } }
                    case '200+':   return { price: { $gte: 200 } }
                    default: return {}
                }
            })
            if (priceConditions.length > 0) {
                query.$or = [...(query.$or || []), ...priceConditions]
            }
        }

        // ✅ Sort
        let sortOption = {}
        switch (sort) {
            case 'low':     sortOption = { price: 1 }; break;
            case 'high':    sortOption = { price: -1 }; break;
            case 'popular': sortOption = { rate: -1 }; break;
            default:        sortOption = { createdAt: -1 }; // latest
        }

        const productsData = await Product.find(query, { color: 0, highlights: 0 })
            .skip(skip)
            .limit(limit)
            .sort(sortOption)

        res.status(200).json({
            status: 'success',
            data: { products: productsData }
        })

    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message })
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