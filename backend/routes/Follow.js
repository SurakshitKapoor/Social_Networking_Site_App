const express = require('express');
const router = express.Router();

const {auth} = require("../middlewares/auth");
const { follow, unfollow, getAllFollowingOfUser, getAllFollowersOfUser } = require('../controllers/Follow');


router.put('/follow/:fId', auth, follow);
router.put('/unfollow/:fId', auth, unfollow);
router.get('/getAllFollowingOfUser', auth, getAllFollowingOfUser);
router.get('/getAllFollowersOfUser', auth, getAllFollowersOfUser);


module.exports = router;