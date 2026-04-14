



const express = require('express');


const router = express.Router();

const {register,login,getAllUsers} = require('../controllers/users.controller')

const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');
const validation = require('../middlewares/validation');
const {idValidation,registerValidation,loginValidation}= require('../middlewares/validationRules');



router.get('/',verifyToken,verifyRole(['admin']),getAllUsers);

router.post('/register',
    registerValidation,
    validation,
    register)

router.post('/login',
    loginValidation,
    validation,
    login)




module.exports = router
