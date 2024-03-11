const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    bio:{
        type:String,
        maxLength:100,
    },
    profileImgUrl: {
        type:String,
    },
});

module.exports = mongoose.model("Profile", profileSchema);
