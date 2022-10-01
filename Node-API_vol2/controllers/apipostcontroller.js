const Register = require('../models/register');
const jwt = require('jsonwebtoken');
const userPost = require('../models/userpost');



const api_userPost = async (req, res) => {
    const {userId, authorId, postId, postBody} = req.body;
    //let _id = userId;
    let rd = Math.floor(Math.random() * (1000 - 0 + 1000)) + 0;
    let post_Id = Date().substring(22, 25).trim()+rd; //dateFormat("hh:mm:ss");

    let user = await Register.find({_id:userId})
 console.log(">>>>>>>>>>>>>>>> user: "+user);
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
        authorId,
        userId,
        postId: post_Id,
        postBody
    })
    //var token = jwt.sign({ id: user.id }, "password")
       console.log(">>>>>>>>>>>>User post: "+post)
      if (userId == '' || postBody == '' || authorId == '') {
          return res.status(404).json({
              status: "Failed",
              message: "User post failed, No data supplied by the user",
          })
      } else {
          await post.save().then((result) => {
            console.log(">>>>>>>>>>>>Username: "+user);
              return res.json({
                  status: "sucess",
                  message: "The Post is successful",
                  data: {"userInfo": user, "body": result.postBody, "date": result.createdAt}
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


module.exports = {
    api_userPost
}