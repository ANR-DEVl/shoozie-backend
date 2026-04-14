
const express = require('express');
const {body,param}= require('express-validator')

const router = express.Router();

const {getAllOrders,getOrder,addOrder,deleteOrder,getAllTitles} = require('../controllers/orders.controller');

const verifyToken = require('../middlewares/verifyToken')
const verifyRole = require('../middlewares/verifyRole')
const validation = require('../middlewares/validation');
const {newOrderValidation,idValidation}= require('../middlewares/validationRules')





router.route('/')
    .get(verifyToken,verifyRole(['admin']),getAllOrders)
    .post(newOrderValidation,validation,addOrder);

router.get('/titles',getAllTitles)


router.route('/:id')
    .get(idValidation,validation,getOrder)
    .delete(idValidation,validation,verifyToken,verifyRole(['admin']),deleteOrder);







module.exports = router
