const express = require('express');
//const jwt = require('jsonwebtoken');
// const Register = require('../models/register');
const apicontroller = require('../controllers/apicontroller');
const router = express.Router();

router.post('/login', apicontroller.api_login);
router.post('/register', apicontroller.api_register)
router.get('/homepage', apicontroller.api_homepage);
router.get('/register/users/:id', apicontroller.api_findUserById);
router.delete('/register/users/:id', apicontroller.api_deleteUser);
router.get('/register/users', apicontroller.api_allUser);
router.put('/register/users/:id', apicontroller.api_updateUserRecord);


module.exports = router;