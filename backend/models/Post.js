const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    post: {
        type:String,
        trim:true,
        maxLength:50,
    },
    createAt: {
        type:Date,
        default:Date.now(),
    },
    updatedAt: {
        type:Date,
        default:Date.now(),
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
})

module.exports = mongoose.model('Post', postSchema);