const express = require('express');
const app = express();

require('dotenv').config();
const Port = process.env.PORT || 5000;

app.listen(Port, function(req, resp){
    console.log("App is live at Port Number : ", Port);
})

app.get('/', (req, resp) => {
    resp.send(`<h1> We are at HomePage of our Social Networking App </h1>`);
    console.log("Reached HomePage of our Social Site App");
})

const dbConnect = require('./config/database');
dbConnect();

app.use(express.json());

const userRoutes = require('./routes/User');
app.use('/api/v1', userRoutes);
const profileRoutes = require('./routes/Profile');
app.use("/api/v1", profileRoutes);
const postRoutes = require('./routes/Post');
app.use("/api/v1", postRoutes);
const followRoutes = require("./routes/Follow");
app.use("/api/v1", followRoutes);