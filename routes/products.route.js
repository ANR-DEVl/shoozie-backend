
const express = require('express');

const {body,param}= require('express-validator')

const {getAllProducts,getProduct,addProduct,deleteProduct,editProduct} = require('../controllers/products.controller')

const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validation = require('../middlewares/validation');
const {idValidation,addProductValidation}= require('../middlewares/validationRules')


const router = express.Router();


router.route('/')
    .get(getAllProducts)
    .post(
        addProductValidation,
        validation,
        verifyToken,verifyRole(['admin']),addProduct)

router.route('/:id')
    .get(idValidation,validation,getProduct)
    .patch(idValidation,validation,verifyToken,verifyRole(['admin']),editProduct)
    .delete(idValidation,validation,verifyToken,verifyRole(['admin']),deleteProduct)



    module.exports = router