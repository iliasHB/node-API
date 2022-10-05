const Register = require('../models/register');
const jwt = require('jsonwebtoken');
const userPost = require('../models/userpost');
const postComment = require('../models/comment');
const postLike = require('../models/like');
//const mongoose = require("mongoose");



const api_userPost = async (req, res) => {
    const { userId, authorId, postBody } = req.body;
    //let _id = userId;
    let rd = Math.floor(Math.random() * (1000 - 0 + 1000)) + 0;
    let post_Id = Date().substring(22, 25).trim() + rd; //dateFormat("hh:mm:ss");

    let user = await Register.find({ _id: userId })
    console.log(">>>>>>>>>>>>>>>> user: " + user);
    //console.log(">>>>>>>>>>>>>>>> username: "+user);
    if (!user) {
        return res.json({
            status: "Failed",
            message: "User does not exist"
        })
    } else if (userId !== authorId) {
        return res.json({
            status: "Failed",
            message: "You don't have permission to post"
        })
    }

    let post = new userPost({
        authorId, //new mongoose.Types.ObjectId(),
        userId, //new mongoose.Types.ObjectId(),
        username: user.username,
        postId: post_Id,
        postBody
    })
    //var token = jwt.sign({ id: user.id }, "password")
    console.log(">>>>>>>>>>>>User post: " + post)
    if (userId == '' || postBody == '' || authorId == '') {
        return res.status(404).json({
            status: "Failed",
            message: "User post failed, No data supplied by the user",
        })
    } else {
        await post.save().then((result) => {
            console.log(">>>>>>>>>>>> Username: " + user);
            return res.json({
                status: "sucess",
                message: "The Post is successful",
                data: { "userInfo": user, "body": result }
            })
        }).catch((error) => {
            return res.status(404).json({
                status: "Failed",
                message: "No response from the backend",
                data: error
            })
        })
    }
}

const api_comment = async (req, res) => {
    const { userId, postId, username, post_comment } = req.body;

    let user = await Register.findOne({ _id: userId })
    if (!user) {
        console.log('No record')
        return res.status(404).json({
            status: "Failed",
            message: "User does not exist"
        })
    }
    let post = await userPost.findOne({ _id: postId })
    if (!post) {
        return res.status(404).json({
            status: "Failed",
            message: "No post to comment"
        })
    }
    let comment = new postComment({
        postId,
        userId,
        username,
        post_comment
    })
    console.log(">>>>>>>>>>>>User post: " + post)
    if (userId == '' || post_comment == '' || postId == '') {
        return res.status(404).json({
            status: "Failed",
            message: "User comment failed, No data supplied by the user",
        })
    } else {
        await comment.save().then((result) => {
            console.log(">>>>>>>>>>>> Username: " + user);
            console.log(">>>>>>>>>>>> comment: " + comment);
            return res.json({
                status: "sucess",
                message: "The comment was successful",
                data: { "userInfo": user, 'post': post, "comment": result }
            })
        }).catch((error) => {
            return res.status(404).json({
                status: "Failed",
                message: "No response from the backend",
                data: error
            })
        })
    }
}

const api_allPostComments = async (req, res) => {
    const postId = req.params.id;

    let post = await userPost.findOne({ _id: postId })
    if (!post) {
        return res.status(404).json({
            status: "Failed",
            message: "No post"
        })
    }
    let like = await postLike.find({postId: postId})
    if (!like) {
        return res.status(404).json({
            status: "Failed",
            message: "No like"
        })
    }
    await postComment.find({ postId: postId }).sort({ createdAt: -1 }).then((result) => {
        console.log(result);
        if(like !== ''){
            return res.json({
                status: "Sucess",
                message: "Post comment retrieved successfully",
                data: ({ 'post': post, 'comment': result, "like": like })
            })
        } else {
            like = 0;
            return res.json({
                status: "Sucess",
                message: "Post comment retrieved successfully",
                data: ({ 'post': post, 'comment': result, "like": like })
            })
        }
    }).catch((error) => {
        return res.status(404).json({
            status: "Failed",
            message: "No response from the backend",
            data: error
        })
    })
}

const api_postLike = async (req, res) => {
    const {postId, userId, like} = req.body;
    //const postId = req.params.id;

    let post = await userPost.findOne({ _id: postId })
    if (!post) {
        return res.status(404).json({
            status: "Failed",
            message: "post does not exist"
        })
    }
    let user = await Register.findOne({_id: userId})
    if (!user) {
        return res.status(404).json({
            status: "Failed",
            message: "User does not exist!"
        })
    }

    let userLike = new postLike({
        userId,
        postId,
        like
    })

    if(like == ''){
        return res.json({
            status: 'success',
            message: 'No like for this post'
        })
    } else {
        userLike.save().then((result) => {
            console.log(result);
            return res.json({
                status: 'success',
                message: 'Post liked successfully',
                data: ({"like": result, "userInfo": user})
            })
        })
    }

}


module.exports = {
    api_userPost,
    api_comment,
    api_allPostComments,
    api_postLike
}


