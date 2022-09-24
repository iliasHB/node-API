const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const registerSchema = new Schema({
    username:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true 
    },
},{ timestamps: true });

const Register = mongoose.model("Register", registerSchema);

module.exports = Register;