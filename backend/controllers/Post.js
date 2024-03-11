const Post = require('../models/Post');
const User = require('../models/User');

//createPost
exports.createPost = async(req, resp) => {
    try{
        const post = req.body.post;
        const userId = req.verifiedUser.id;

        if(!userId || !post) {
            return resp.status(404).json({
                success:false,
                message:"Input data is missing !",
            })
        }

        const newPost = await Post.create({post, user:userId});
        console.log("new Post is : ", newPost);

        
        const updatedUser = await User.findByIdAndUpdate(userId, 
            {
                $push: {
                    posts:newPost._id,
                }
            },
            {new:true});
        console.log("updated user is : ", updatedUser);

        return resp.status(200).json({
            success:true,
            message:"Post is created successfully",
            newPost: newPost,
            updatedUser: updatedUser,
        })

    }
    catch(error) {
        console.log("Error while creating the post is : ", error.message);

        return resp.status(500).json({
            success:false,
            message:"Something went wrong while creating the post",
        })
    }
}


//updatePost
exports.updatedPost = async(req, resp) => {
    try{
        const postId = req.params.postId;
        const post = req.body.post;

        if(!postId || !post) {
            return resp.status(404).json({
                success:false,
                message:"Input data is missing !",
            })
        }

        const updatedPost = await Post.findByIdAndUpdate(postId, 
            {
                    post: post,
            }, 
            {new:true});
        console.log("updated post is : ", updatedPost);

        return resp.status(200).json({
            success:true,
            message:"The post is updated successfully !",
            updatedPost: updatedPost,
        })
    }
    catch(error){
        console.log("Error while updating the post : ", error.message);

        return resp.status(500).json({
            success:false,
            message:"Something went wrong while updating the Post",
        })
    }
}


//deletePost
exports.deletePost = async(req, resp) => {
    try{
        const postId = req.params.postId;
        const userId = req.verifiedUser.id;

        if(!userId || !postId){
            return resp.status(404).json({
                success:false,
                message: "Please enter all data"
            })
        }

        const updatedUer = await User.findByIdAndUpdate(userId, 
            {
                $pull: {
                    posts:postId,
                }
            }, 
            {new:true});
        console.log("updated user is : ", updatedUer);

        const deletedPost = await Post.findByIdAndDelete(postId);
        console.log("deleted post is : ", deletedPost);

        return resp.status(200).json({
            success:true,
            message:"The post is deleted successfully",
            updatedUer: updatedUer,
            deletedPost: deletedPost,
        })
    }
    catch(error) {
        console.log("Error while deleting post : ", error.message);

        return resp.status(500).json({
            success: false,
            message: "Failure occured while deleting the Post",
        })
    }
}


//getAllPostsOfUser
exports.getAllPostsOfUser = async(req, resp) => {
    try{
        const userId = req.verifiedUser.id;
        
        if(!userId) {
            return resp.status(404).json({
                success:false,
                message:"The user id is missing !",
            })
        }

        const userDetails = await User.findOne({_id:userId}).populate('posts');
        console.log('posts of a user are : ', userDetails.posts);

        return resp.status(200).json({
            success:true,
            message:"The posts of a user are fetched successfully !",
            userDetails:userDetails,
            posts:userDetails.posts,
        })
    }
    catch(error) {
        console.log('Error while getting all posts : ', error.message);

        return resp.status(500).json({
            success:false,
            message:"Failure to getAllPosts"
        })
    }
}


//getPostById 
exports.getPostById = async(req, resp) => {
    try{
        const postId = req.params.postId;

        if(!postId) {
            return resp.status(404).json({
                success:false,
                message:"Post Id is missing !",
            })
        }

        const post = await Post.find({_id:postId});
        console.log("post is : ", post);

        return resp.status(200).json({
            success:true,
            message:"Fteched the post successfully", 
            post: post,
        })
    }
    catch(error) {
        console.log('Error while getting a post by its id : ', error.message);

        return resp.status(500).json({
            success:false,
            message:"Failure to a post by id"
        })
    }
}


//getAllPosts 
exports.getAllPosts = async(req, resp) => {
    try{
        const posts = await Post.find({});
        console.log("all posts are : ", posts);

        return resp.status(404).json({
            success:true,
            message:"Fetched all posts successfully", 
            posts: posts,
        })
    }
    catch(error){
        console.log("Error while getting all posts : ", error.message);

        return resp.status(500).json({
            success:false,
            message:"Something went wrong while getting all Posts",
        })
    }
}