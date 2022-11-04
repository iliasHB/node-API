const Register = require('../models/register');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


const api_login = async (req, res) => {
    const { email, password } = req.body
    try {
        await Register.findOne({ email: email, password: password }, function (error, user) {
            console.log(">>>>>>>>>>" + user.email)
            console.log(">>>>>>>>>>" + user.password)
            if (!user) {
                return res.status(404).json({
                    status: "Failed",
                    message: "User does not exist",
                })
            } else if (user.password != password) {
                return res.status(404).json({
                    status: "Failed",
                    message: "Password is Incorrect",
                })
            } else if (!user.password) {
                console.log("wrong password")
            } else {
                var token = jwt.sign({ id: user.id }, "password")
                return res.json({
                    status: "Sucess",
                    message: "Login successful",
                    token: token,
                    data: user
                })
            }
        })

    } catch (error) {
        console.log(`Error: ${error}`)
    }

}


///------------ Register User API --------------------------
const api_register = async (req, res) => {
    //var token = jwt.sign({ id: user.id }, "password")
    const { username, email, password } = req.body
    console.log(username)
    console.log(password)
    console.log(email)
    try {
        await Register.findOne({ email },
            function (error, user) {
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
                        let rd = Math.floor(Math.random() * (1000 - 0 + 1000)) + 0;
                        let otpcode = Date().substring(22, 25).trim() + rd;
                        handleSendOTP(username, email, otpcode, function (done) {
                            if (done === "Successful") {
                                user.save().then((result) => {
                                    return res.json({
                                        status: "sucess",
                                        message: "The registeration is successful",
                                        token: token,
                                        data: result
                                    })
                                }).catch((error) => {
                                    return res.status(404).json({
                                        status: "Failed",
                                        message: "No response from the backend",
                                        data: error
                                    })
                                })

                            } else {
                                console.log("No otp sent")
                            }

                        })

                    }
                }
            }
        )

    } catch (error) {
        console.log(`Message: ${error}`)
    }
}

function handleSendOTP(email, username, otpcode, done) {
    console.log("email: "+email)
    console.log("username: "+username)
    console.log("otpcode: "+otpcode)
    let company = "Soft-Engine"

    const output = `
    <p>You have a new request</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${username}</li>
        //<li>Company: ${company}</li>
        <li>Email: ${email}</li>
    </ul>
    <h3>Message</h3>
    <p>${otpcode}</p>
    `

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL, // generated ethereal user testAccount.user,
            pass: process.env.PASSWORD // generated ethereal password
        },
        tls: {
            rejectUnauthorization: false,
        }
    });

    console.log("email: "+process.env.EMAIL)
    console.log("password: "+process.env.PASSWORD)

    let mailOptions = {
        from: "Nodemailer contact 👻" + process.env.EMAIL, // sender address
        to: 'abeeb.ilias@gmail.com', // list of receivers "bar@example.com, baz@example.com"
        subject: "Email Verification", // Subject line
        text: "WELCOME, Pls, verify the otp below in out application", // plain text body
        html: output // html body
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        console.log(">>>>>>>>>>> here <<<<<<<<<<<<<<<<<")
        if (error) {
            console.log(`>>>>> Error message: ${error}`);
            console.log(">>>>>>>>>>> Error here <<<<<<<<<<<<<<<<<")
        } else {
            console.log(">>>>>>>>>>> Success here <<<<<<<<<<<<<<<<<")
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            return done
        }
    });


}

const api_homepage = (req, res) => {
    let token = req.header("token");
    if (!token) {
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
    try {
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
    } catch (error) {
        console.log(`Message: ${error}`)
    }

}
///------------ API to delete a Particular user record --------------
const api_deleteUser = (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
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
    } catch (error) {
        console.log("Message: " + error)
    }

}
///----------- List of all register user API -------------------
const api_allUser = (req, res) => {
    try {
        Register.find().sort({ createdAt: -1 }).then((user) => {
            console.log(user);
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
    } catch (error) {
        console.log("Message: " + error)
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

    if (!token) {
        return res.status(404).json({
            status: "Failed",
            message: "You don't have access to edit a record",
        })
    } else {
        var decoded = jwt.verify(token, "password");
        console.log(decoded.id);
        try {
            if (decoded) {
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
            } else {
                res.status().json({
                    status: "Failed",
                    message: "Unable to decode access token"
                })
            }

        } catch (error) {
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