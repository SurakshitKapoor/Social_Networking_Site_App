const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then( () => {console.log("DB is connected ")})
    .catch( (err) => {
        console.log("Failed to connect with DB!");
        console.log("error is : ", err.message);
    })   
}

module.exports = dbConnect;