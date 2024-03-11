const express = require('express');
const router = express.Router();

router.get('/', (req, resp) => {
    console.log("Routes testing is fine");
    resp.status(200).json({
        success:true,
        message:"Routes are working fine",
    })
});

const { signup, login } = require('../controllers/Auth');
const {auth} = require('../middlewares/auth');

router.post('/signup', signup);
router.get("/login", login);
router.get('/auth', auth, (req, resp) => {
    console.log("Authentication is done");
    resp.status(200).json({
        success:true,
        message:"Authentication is done!",
        verifiedUser: req.verifiedUser,
    });
});


module.exports = router;