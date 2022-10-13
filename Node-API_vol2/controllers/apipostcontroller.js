const Register = require('../models/register');
const jwt = require('jsonwebtoken');
const userPost = require('../models/userpost');
const postComment = require('../models/comment');
const postLike = require('../models/like');
const commentLike = require('../models/comment_like');
const comment = require('../models/comment');



const api_userPost = async (req, res) => {
    const { userId, authorId, postBody, username } = req.body;

    let rd = Math.floor(Math.random() * (1000 - 0 + 1000)) + 0;
    let post_Id = Date().substring(22, 25).trim() + rd; //dateFormat("hh:mm:ss");

    try {
        await Register.findOne({ _id: userId },
            function (error, user) {
                console.log(">>>>>>>>>>>> Username: " + user.username);
                if (!user) {
                    return res.json({
                        status: "Failed",
                        message: "User does not exist"
                    })
                }
                else if (error) {
                    return res.json({
                        status: "Failed",
                        message: "Server error",
                        Error: error
                    })
                }
                else if (userId !== authorId) {
                    return res.json({
                        status: "Failed",
                        message: "You don't have permission to post"
                    })
                } else {
                    console.log(">>>>>>>>>>>> Username: " + user.username);
                    let post = new userPost({
                        authorId, //new mongoose.Types.ObjectId(),
                        userId, //new mongoose.Types.ObjectId(),
                        username: user.username,
                        postId: post_Id,
                        postBody
                    })
                    //var token = jwt.sign({ id: user.id }, "password")
                    if (userId == '' || postBody == '' || authorId == '') {
                        return res.status(404).json({
                            status: "Failed",
                            message: "User post failed, No data supplied by the user",
                        })
                    } else {
                        console.log(">>>>>>>>>>>> Username: " + user.username);
                        post.save().then((result) => {
                            console.log(">>>>>>>>>>>> Username: " + user.username);
                            return res.json({
                                status: "sucess",
                                message: "The Post is successful",
                                data: result
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
            }
        )
    } catch (error) {
        console.log("Message: " + error)
    }

}

const api_deletePost = async (req, res) => {
    const postId = req.params.id;
    const commentId = req.body;

    try {
        await userPost.findOneAndDelete({ _id: postId },
            function (error, post) {
                if (!post) {
                    res.status(404).json({
                        status: "Failed",
                        message: "Post does not exist"
                    })
                } else if (error) {
                    console.log("Message: " + error)
                } else {
                    console.log(">>>>>>>> Post exist <<<<<<<<<<<<<")
                    postLike.deleteMany({ postId: postId },
                        function (error, like) {
                            if (!like) {
                                return res.status(404).json({
                                    status: "Failed",
                                    meassage: "No post found"
                                })
                            } else {
                                console.log(">>>>>>>> post Like exist <<<<<<<<<<<<<")
                                postComment.deleteMany({ postId: postId },
                                    function (error, comment) {
                                        if (!comment) {
                                            return res.status(404).json({
                                                status: "Failed",
                                                meassage: "No post to delete"
                                            })
                                        } else {
                                            console.log(">>>>>>>> post comment exist <<<<<<<<<<<<<")
                                            //>>>>>>>>>>>>>>> comment not deleting <<<<<<<<<<<<<<<<<<
                                            commentLike.find({ commentId: commentId }, function (error, cLike) {
                                                if (!cLike) {
                                                    return res.status(404).json({
                                                        status: "Failed",
                                                        meassage: "No comment like found"
                                                    })
                                                } else {
                                                    console.log(">>>>>>>> comment Like exist <<<<<<<<<<<<<")
                                                    commentLike.deleteMany({ commentId: commentId }, function (error, cmLike) {
                                                        if (!cmLike) {
                                                            console.log(">>>>>>>>no postID like")
                                                            return res.status(404).json({
                                                                status: "Failed",
                                                                meassage: "No comment like not deleted"
                                                            })
                                                        } else {
                                                            console.log(">>>>>>>> All post activities deleted !!!! <<<<<<<<<<<")
                                                            return res.status(404).json({
                                                                status: "Failed",
                                                                meassage: "Post deleted successfully",
                                                                data: ({
                                                                    "post": "deleted " + post.deletedCount + " post",
                                                                    "post_like": "deleted " + like.deletedCount + " post likes",
                                                                    "comment": "deleted " + comment.deletedCount + " comments",
                                                                    "comment_like": "deleted " + cmLike.deletedCount + " comment likes"
                                                                })
                                                            })
                                                        }
                                                    })
                                                }
                                            })

                                        }
                                    }
                                )

                            }
                        }
                    )
                }
            }
        )
    } catch (error) {
        console.log(`Message: ${error}`)
    }

}
// const api_deletePost = (req, res) => {
//     const id = req.params.id;
//     console.log(id);
//     try {
//         userPost.findByIdAndDelete(id).then((user) => {
//             postLike.findAndDelete({postId: postId}, 
//                 function(error, postlike){
//                     if(!postlike){
//                         return res.status(404).json({
//                             status: "Sucess",
//                             message: "Post does not exist",                    
//                         })
//                     } else {
//                         return res.json({
//                             status: "Sucess",
//                             message: "Post deleted successfully",
//                             data: user
//                         })
//                     }
//             })

//         }).catch((error) => {
//             console.log(error)
//             return res.status(404).json({
//                 status: "Failed",
//                 message: "No response from the backend",
//                 data: error
//             })
//         })
//     } catch (error) {
//         console.log("Message: " + error)
//     }

// }

const api_comment = async (req, res) => {
    const { userId, postId, post_comment } = req.body;
    try {
        await Register.findOne({ _id: userId },
            function (error, user) {
                if (!user) {
                    console.log('No record')
                    return res.status(404).json({
                        status: "Failed",
                        message: "User does not exist"
                    })
                } else {
                    userPost.findOne({ _id: postId },
                        function (error, post) {
                            if (!post) {
                                return res.status(404).json({
                                    status: "Failed",
                                    message: "No post to comment"
                                })
                            } else {

                                let comment = new postComment({
                                    postId,
                                    userId,
                                    username: user.username,
                                    post_comment
                                })
                                console.log(">>>>>>>>>>>>>Username " + user.username)
                                console.log(">>>>>>>>>>>>User post: " + post)
                                if (userId == '' || post_comment == '' || postId == '') {
                                    return res.status(404).json({
                                        status: "Failed",
                                        message: "User comment failed, No data supplied by the user",
                                    })
                                } else {
                                    comment.save().then((result) => {
                                        console.log(">>>>>>>>>>>> Username: " + user.username);
                                        console.log(">>>>>>>>>>>> comment: " + comment);
                                        return res.json({
                                            status: "sucess",
                                            message: "The comment was successful",
                                            data: { 'post': post, 'comment': result }
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
                        }
                    )

                }
            }
        )
    } catch (error) {
        console.log("Message: " + error)
    }

}

const api_allPostComments = async (req, res) => {
    const postId = req.params.id;
    try {
        await userPost.findOne({ _id: postId },
            function (error, post) {
                if (!post) {
                    return res.status(404).json({
                        status: "Failed",
                        message: "No post"
                    })
                } else {

                    console.log(">>>>>>>>>>>>>>> code here")
                    postComment.find({ postId: postId }).sort({ createdAt: -1 }).then((comment) => {
                        console.log(comment);

                        return res.json({
                            status: "Sucess",
                            message: "Post comment retrieved successfully",
                            data: ({ 'post': post, 'comment': comment, "like": like = 0 })
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
        )
    } catch (error) {
        console.log(`Message: ${error}`)
    }

}

const api_commentLike = async (req, res) => {
    const { userId, commentId, like, username } = req.body;
    try {
        await Register.findOne({ _id: userId },
            function (error, user) {
                if (!user) {
                    console.log('No record')
                    return res.status(404).json({
                        status: "Failed",
                        message: "User does not exist"
                    })
                } else {
                    comment.findOne({ _id: commentId },
                        function (error, comment) {
                            if (!comment) {
                                return res.status(404).json({
                                    status: "Failed",
                                    message: "Comment does not exist"
                                })
                            } else {
                                commentLike.findOne({ userId: userId, commentId: commentId },
                                    function (error, isLike) {
                                        if (isLike) {
                                            console.log(">>>>>>> User alerady like this post <<<<<<<")
                                            return res.status(404).json({
                                                status: 'Failed',
                                                message: 'User alerady like this comment'
                                            })
                                        }
                                        else {
                                            let comment_Like = new commentLike({
                                                userId,
                                                commentId,
                                                username: user.username,
                                                like
                                            })
                                            console.log(">>>>>>>>> username" + user.username);
                                            if (like > 1) {
                                                console.log(">>>>>>>>>>>>>>> like: " + like)
                                                return res.status(404).json({
                                                    status: 'Failed',
                                                    message: 'Duplicate like from the same user'
                                                })
                                            } else if (like == 0) {
                                                return res.status(404).json({
                                                    status: 'Failed',
                                                    message: `No likes from ${user.username}`
                                                })
                                            } else {
                                                comment_Like.save().then((like) => {
                                                    console.log(like);
                                                    return res.json({
                                                        status: 'success',
                                                        message: 'Post liked successfully',
                                                        data: ({ 'comment': comment.post_comment, "like": like, })
                                                    })
                                                })
                                            }
                                        }

                                    }
                                )
                            }
                        }
                    )
                }
            }
        )
    } catch (error) {
        console.log("Message: " + error)
    }

}

const api_postLike = async (req, res) => {
    const { postId, userId, like, username } = req.body;
    try {
        await userPost.findOne({ _id: postId },
            function (error, post) {
                if (!post) {
                    return res.status(404).json({
                        status: "Failed",
                        message: "post does not exist"
                    })
                } else {
                    Register.findOne({ _id: userId },
                        function (error, user) {
                            if (!user) {
                                return res.status(404).json({
                                    status: "Failed",
                                    message: "User does not exist!"
                                })
                            } else if (user) {
                                postLike.findOne({ userId: userId, postId: postId },
                                    function (error, isLike) {
                                        if (isLike) {
                                            console.log(">>>>>>>>>>>>>>> User alerady like this post")
                                            return res.status(404).json({
                                                status: 'Failed',
                                                message: 'User alerady like this post'
                                            })
                                        }
                                        else {
                                            let userLike = new postLike({
                                                userId,
                                                postId,
                                                username: user.username,
                                                like
                                            })
                                            console.log(">>>>>>>>> username" + user.username);
                                            if (like > 1) {
                                                console.log(">>>>>>>>>>>>>>> like: " + like)
                                                return res.status(404).json({
                                                    status: 'Failed',
                                                    message: `Duplicate like from ${user.username}`
                                                })
                                            } else if (like == 0) {
                                                return res.status(404).json({
                                                    status: 'Failed',
                                                    message: 'Zero like is not allow'
                                                })
                                            } else {
                                                userLike.save().then((like) => {
                                                    console.log(like);
                                                    return res.json({
                                                        status: 'success',
                                                        message: 'Post liked successfully',
                                                        data: ({ 'post': post.postBody, "like": like })
                                                    })
                                                })
                                            }
                                        }

                                    }
                                )
                            }

                        }
                    )
                }
            }
        )
    } catch (error) {
        console.log(`Message: ${error}`)
    }
}

const api_postActivity = async (req, res) => {
    const postId = req.params.id;

    try {
        await userPost.findOne({ _id: postId },
            function (error, post) {
                if (!post) {
                    res.status(404).json({
                        status: "Failed",
                        message: "User does not exist"
                    })
                } else if (error) {
                    console.log("Message: " + error)
                } else {
                    console.log(">>>>>>>> User exit <<<<<<<<<<<<<")
                    //Register.findOne(_id)
                    postComment.find({ postId: postId }).sort({ createdAt: -1 }).then((comment) => {
                        //let like = 
                        postLike.find({ postId: postId },
                            function (error, like) {
                                if (!like) {
                                    console.log(">>>>>>>>no postID like")
                                    return res.status(404).json({
                                        status: "Failed",
                                        meassage: "No post found"
                                    })
                                } else {
                                    return res.json({
                                        status: "Sucess",
                                        message: "Post engagement retrieved successfully",
                                        data: ({
                                            'post': post, 'comment': comment, "post_like": like,
                                        }) // "total_post_likes": post.like.toString().length 
                                    })
                                }
                            }
                        )

                    })

                }
            }
        )
    } catch (error) {
        console.log(`Message: ${error}`)
    }

}

module.exports = {
    api_userPost,
    api_deletePost,
    api_comment,
    api_commentLike,
    api_allPostComments,
    api_postLike,
    api_postActivity
}






// app.post("/profileUpdate", function (request, result) {

//     var accessToken = request.fields.accessToken;
//     var name = request.fields.name;
//     var dob = request.fields.dob;
//     var gender = request.fields.gender;
//     var country = parseInt(request.fields.country, 10);
//     var state = parseInt(request.fields.state, 10);
//     var city = parseInt(request.fields.city, 10);
//     var aboutMe = request.fields.aboutMe;

//     database.collection("users").findOne({
//         "accessToken": accessToken
//     }, function (error, user) {
//         if (user == null) {
//             result.json({
//                 "status": "error",
//                 "message": "User has been logged out. Please login again."
//             });
//         } else {
//             database.collection("states_cities").findOne({
//                 "id": state
//             }, function(error, data){
//                 state = {"name": data.name,
//                         "id": data.id}
//             });
//             database.collection("states_cities").findOne({
//                 "cities.id": city
//             }, function(error, data){
//                 city = {"name": data.cities.$.name,
//                         "id": data.cities.$.id}
//             });

//             database.collection("users").updateOne({
//                 "accessToken": accessToken
//             }, {
//                 $set: {
//                     "name": name,
//                     "dob": dob,
//                     "country": country,
//                     "state": state,
//                     "city": city,
//                     "gender": gender,
//                     "aboutMe": aboutMe,
//                 }
//             }, function (error, data) {
//                 result.json({
//                     "status": "success"
//                 });
//             });
//         }
//     });
// });