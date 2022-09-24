const express = require("express")
const mongoose = require("mongoose")
const Register = require('./models/register');

const app = express();
const dbUri = 'mongodb://localhost:27017/selfdb';
// app.listen(5000), () => {
//         console.log("Listening on port 5000 !!!")
//}
async function connectDB() {
    mongoose.connect(dbUri,
        (err) => {
            if (err) {
                console.log(">>>>> database Failed: " + err)
            } else {
                console.log(">>>>>> Successfully connected to database!!!")
                app.listen(5000, () => console.log("Listening on port 5000 !!!"))
            }
        },
        { useNewUrlParser: true, useUnifiedTopology: true })
    //  .then((result) => app.listen(5000, () => 
    //     console.log("Listening on port 5000 !!!")))
    //  .catch((error) => console.log(">>>>>> Listening Failed:"+error))
}

connectDB()
app.use(express.json({ extended: false }));

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.post('/register', function (req, res) {
    const { username, email, password } = req.body
    console.log(username)
    console.log(password)
    console.log(email)

    //var schema = new mongoose.Schema({username: "string", email: "string", password: "string"});
    //var Register = mongoose.model("Register", schema);
    const user = new Register({
        username, //"Habeeb",
        email, //"abe@gmail.com",
        password, //"12345"
    })
    console.log(user)
    if (username == '' || email == '' || password == ''){
        res.status(404).json({
            status: "fail",
            message: "The registeration failed",
        })
    } else {
        user.save().then((result) => {
            res.json({
                status: "sucess",
                message: "The registeration is successful",
                data: result
            })
        })
    }
   
});


// .catch((error) => {
    //     error.status(404).json({
    //         status: "fail",
    //         message: "The registeration failed",
    //         //data: "1234567898998645560"
    //     })//send('Blog failed to save')