const express = require('express');
const router = express.Router();


const { createPost, updatedPost, 
        getAllPostsOfUser, getPostById, 
        getAllPosts, 
        deletePost} = require('../controllers/Post');
const { auth } = require('../middlewares/auth');


router.post('/createPost', auth, createPost);
router.put('/updatePost/:postId', auth, updatedPost);
router.delete('/deletePost/:postId', auth, deletePost);
router.get('/getAllPostsOfUser', auth, getAllPostsOfUser);
router.get('/getPostById/:postId', auth, getPostById);
router.get('/getAllPosts', auth, getAllPosts);


module.exports = router;