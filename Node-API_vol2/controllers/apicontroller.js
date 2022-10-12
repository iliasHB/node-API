const Register = require('../models/register');
const jwt = require('jsonwebtoken');

const api_login = async (req, res) => {
    const { email, password } = req.body
    let user = await Register.find({ email, username })

    console.log(user)
    if (!user) {
        return res.status(404).json({
            status: "Failed",
            message: "User does not exist",
        })
    } else if (user.password !== password) {
        return res.status(404).json({
            status: "Failed",
            message: "Password is Incorrect",
        })
    } else {
        var token = jwt.sign({ id: user.id }, "password")
        return res.json({
            status: "Sucess",
            message: "Login successful",
            token: token,
            data: user
        })
    }
}


///------------ Register User API --------------------------
const api_register = async (req, res) => {
      //var token = jwt.sign({ id: user.id }, "password")
      const { username, email, password } = req.body
      console.log(username)
      console.log(password)
      console.log(email)
      try{
        await Register.findOne({ email },
            function(error, user){
                if (user) {
                    return res.status(404).json({
                        status: "Failed",
                        message: "Registration Failed, email already exist",
                    })
                } else {
                    user = new Register({
                        username,
                        email,
                        password,
                    })
                    var token = jwt.sign({ id: user.id }, "password")
                    console.log(user)
                    if (username == '' || email == '' || password == '') {
                        return res.status(404).json({
                            status: "Failed",
                            message: "Registeration failed, No data supplied by the user",
                        })
                    } else {
                        user.save().then(() => {
                            return res.json({
                                status: "sucess",
                                message: "The registeration is successful",
                                data: token
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
      
      
      }catch(error){
        console.log(`Message: ${error}`)
      }
      l
  
  }

const api_homepage = (req, res) => {
    let token = req.header("token");
    if(!token) {
        return res.status(404).json({
            status: "Failed",
            message: "You don't have access to this page",
        })
    } else {
        var decoded = jwt.verify(token, "password");
        console.log(decoded.id);
        return res.json({
            status: "Success",
            message: "Welcome to homepage",
            data: []
        })
    }
}
///------------ API to retrieve a Particular user record --------------
const api_findUserById = (req, res) => {
    const id = req.params.id;
    try{
        console.log(id);
        Register.findById(id).then((user) => {
            return res.json({
                status: "Sucess",
                message: "User found successfully",
                data: user
            })
    
        }).catch(error => {
            console.log(error)
            return error.status(404).json({
                status: "Failed",
                message: "No response from the backend",
                data: error
            })
        })
    }catch(error){
        console.log(`Message: ${error}`)
    }
    
}
///------------ API to delete a Particular user record --------------
const api_deleteUser = (req, res) => {
    const id = req.params.id;
    console.log(id);
    try{
        Register.findByIdAndDelete(id).then((user) => {
            return res.json({
                status: "Sucess",
                message: "User deleted successfully",
                data: user
            })
        }).catch((error) => {
            console.log(error)
            return res.status(404).json({
                status: "Failed",
                message: "No response from the backend",
                data: error
            })
        })
    }catch(error){
        console.log("Message: "+error)
    }
    
}
///----------- List of all register user API -------------------
const api_allUser = (req, res) => {
    try {
        Register.find().sort({ createdAt: -1 }).then((user) => {
            console.log(result);
            return res.json({
                status: "Sucess",
                message: "Register users retrieved successfully",
                data: user
            })
        }).catch((error) => {
            return res.status(404).json({
                status: "Failed",
                message: "No response from the backend",
                data: error
            })
        })
    } catch (error){
        console.log("Message: "+error)
    }
   
}
///---------API to update user record ------------------------
const api_updateUserRecord = async (req, res) => {
    let id = req.params.id;
    let token = req.header("token");
    //let { Username, Email, Password } = req.body
    let Username = req.body.username;
    let Email = req.body.email;
    let Password = req.body.password;

    console.log(">>>>>>>>>> id: " + id)

    if(!token) {
        return res.status(404).json({
            status: "Failed",
            message: "You don't have access to edit a record",
        })
    } else {
        var decoded = jwt.verify(token, "password");
        console.log(decoded.id);
        try{
            Register.findOneAndUpdate(
                { _id: id },
                { $set: { username: Username, email: Email, password: Password } },
                { new: true }, (err, data) => {
                    if (err) {
                        return res.json({
                            status: "Failed",
                            message: "No record found to Update"
                        })
                    } else if (data == null) {
                        return res.json({
                            status: null,
                            message: "No data"
                        })
                    } else {
                        console.log(data);
                        return res.json({
                            status: "Success",
                            message: data
                        })
                       
                    }
                })
        } catch(error){
            console.log(`Message: ${error}`)
        }
       
    }

    
}



module.exports = {
    api_login,
    api_register,
    api_homepage,
    api_findUserById,
    api_deleteUser,
    api_allUser,
    api_updateUserRecord,
}