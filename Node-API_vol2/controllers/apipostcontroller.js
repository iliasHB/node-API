const Register = require('../models/register');
const jwt = require('jsonwebtoken');
const userPost = require('../models/userpost');



const api_userPost = async (req, res) => {
    const {userId,postId, username, postBody} = req.body;
    let rd = Math.floor(Math.random() * (1000 - 0 + 1000)) + 0;
    let post_Id = Date().substring(22, 25).trim()+rd; //dateFormat("hh:mm:ss");
    //console.log(">>>>>>>>>>>>>>>>ramdom: "+rd);
    //console.log(">>>>>>>>>>>>>>>> date: "+dt);
    let user = await Register.findOne({username});
    if (!user) {
        return res.json({
            status: "Failed",
            message: "User does not exist"
        })
    } else {
        user = new userPost({
            userId,
            postId: post_Id,
            username,
            postBody
        })
    }
    //var token = jwt.sign({ id: user.id }, "password")
       console.log(user)
      if (userId == '' || username == '' || postBody == '') {
          return res.status(404).json({
              status: "Failed",
              message: "User post failed, No data supplied by the user",
          })
      } else {
          await user.save().then((result) => {
              return res.json({
                  status: "sucess",
                  message: "The Post is successful",
                  data: [result.username, result.postBody]
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