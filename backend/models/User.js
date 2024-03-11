const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    confirmPassword:{
        type:String,
        required:true,
    },
    profile:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Profile'
    },
    posts: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
        default:undefined,
    }],
    follow: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Follow'
    }
    
});

module.exports = mongoose.model("User", userSchema);
