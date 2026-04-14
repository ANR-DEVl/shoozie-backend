const { param,body,query } = require('express-validator')


const newOrderValidation = [
body('clientData.fullName')
.notEmpty()
.isString()
.withMessage('invalid full name'),

body('clientData.phone')
.notEmpty()
.isString()
.withMessage('invalid phone'),

body('clientData.location.city')
.notEmpty()
.withMessage('city required'),

body('clientData.location.commune')
.notEmpty()
.withMessage('commune required'),

body('orderData.products')
.isArray({min:1})
.withMessage('products required'),

body('orderData.products.*.productId')
.isMongoId()
.withMessage('invalid product id'),

body('orderData.products.*.quantity')
.isInt({min:1})
.withMessage('invalid quantity'),
]


const idValidation = [
    param('id')
        .isMongoId()
        .withMessage('invalid id')
]

const addProductValidation = [
    body('name').notEmpty().isString().isLength({min:6,max:25}).withMessage('invalid title'),
    body('price').isNumeric().withMessage('invalid price'),
    body('description').isString().isLength({min:30}).withMessage('invalid discription')
]



const registerValidation = [

body('fullName')
.notEmpty()
.withMessage('full name required')
.isString()
.isLength({min:3,max:40})
.withMessage('full name must be between 3 and 40 characters'),

body('phone')
.notEmpty()
.withMessage('phone required')
.isString()
.isLength({min:8,max:15})
.withMessage('invalid phone'),

body('userLocation.city')
.notEmpty()
.isString()
.withMessage('location required')
,
body('userLocation.commune')
.notEmpty()
.isString()
.withMessage('location required')
,

body('password')
.notEmpty()
.withMessage('password required')
.isLength({min:6})
.withMessage('password must be at least 6 characters'),



]


const loginValidation = [
body('password')
.notEmpty()
.withMessage('password required')
.isLength({min:6})
.withMessage('password must be at least 6 characters'),

body('phone')
.notEmpty()
.withMessage('phone required')
.isString()
.isLength({min:8,max:15})
.withMessage('invalid phone')
]


module.exports = {idValidation,newOrderValidation,addProductValidation,registerValidation,loginValidation}