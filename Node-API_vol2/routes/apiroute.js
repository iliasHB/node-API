const express = require('express');
//const jwt = require('jsonwebtoken');
// const Register = require('../models/register');
const apicontroller = require('../controllers/apicontroller');
const router = express.Router();

//router.use(express.json({ extended: false }));

router.post('/login', apicontroller.api_login);
router.get('/homepage', apicontroller.api_homepage);
///------------ API to retrieve a Particular user record --------------

router.get('/register/users/:id', apicontroller.api_findUserById);

///------------ API to delete a Particular user record --------------
router.delete('/register/users/:id', apicontroller.api_deleteUser);

///----------- List of all register user API -------------------
router.get('/register/users', apicontroller.api_allUser);

///---------API to update user record ------------------------

router.put('/register/users/:id', apicontroller.api_updateUserRecord);

module.exports = router;