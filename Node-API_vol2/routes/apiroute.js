const express = require('express');
//const jwt = require('jsonwebtoken');
// const Register = require('../models/register');
const apicontroller = require('../controllers/apicontroller');
const apipostcontroller = require('../controllers/apipostcontroller');
const router = express.Router();

router.post('/login', apicontroller.api_login);
router.post('/register', apicontroller.api_register)
router.get('/homepage', apicontroller.api_homepage);
router.get('/register/users/:id', apicontroller.api_findUserById);
router.delete('/register/users/:id', apicontroller.api_deleteUser);
router.get('/register/users', apicontroller.api_allUser);
router.put('/register/users/:id', apicontroller.api_updateUserRecord);

router.post('/posts/user', apipostcontroller.api_userPost); 
router.delete('/posts/delcomment', apipostcontroller.api_deleteComment);

router.post('/posts/comment', apipostcontroller.api_comment);
router.post('/posts/commentlike', apipostcontroller.api_commentLike);
router.post('/posts/postlikes', apipostcontroller.api_postLike); 
router.delete('/posts/delpostlike', apipostcontroller.api_deletePostLike); 
router.delete('/posts/delcommentlike', apipostcontroller.api_deleteCommentLike);
router.delete('/posts/:id', apipostcontroller.api_deletePost);
router.get('/posts/postcomments/:id', apipostcontroller.api_allPostComments);
router.get('/posts/postactivity/:id', apipostcontroller.api_postActivity); 


module.exports = router;