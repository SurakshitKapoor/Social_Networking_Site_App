const express = require('express');
const router = express.Router();

const {auth} = require('../middlewares/auth');
const {updateProfile} = require('../controllers/Profile');

router.put("/updateProfile",auth, updateProfile);

module.exports = router;