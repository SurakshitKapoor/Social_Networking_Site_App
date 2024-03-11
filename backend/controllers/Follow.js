const mongoose = require('mongoose');
const User = require('../models/User');
const Follow = require('../models/Follow');

//follow
exports.follow = async(req, resp) => {
    try{
        const fId = req.params.fId;
        const userId = req.verifiedUser.id;

        if(!userId || !fId) {
            return resp.status(404).json({
                success:false,
                message:"Input data is missing !"
            })
        }

        //fetching user details
        const userDetails = await User.findById(userId);
        console.log("userDetails are : ", userDetails);

        //fetching follow id from userDetails doc
        const followId = userDetails.follow;
        console.log("user's follow id is : ", followId);


        //updating the follow acc. of given user -> by adding in following array
        const updatedFollow = await Follow.findByIdAndUpdate(followId, 
            {
                $push:{
                    //iss fId wale user ko follow karna hai
                    following:fId,
                }
            }, 
            {new:true});
        console.log("updated follow is : ", updatedFollow);

        
        const followeeDetails = await User.findById(fId);
        const followeeId = followeeDetails.follow;

        const updatedFollowee = await Follow.findByIdAndUpdate(followeeId, 
            {
                $push: {
                    followers:userId,
                }
            },
            {new:true});

        //return response of success
        return resp.status(200).json({
            success:true,
            message:"The user started following to other user",
            updatedFollow:updatedFollow,
            updatedOther: updatedFollowee,
        })
    }
    catch(err){
        console.log("Error while following : ", err.message);

        return resp.status(500).json({
            success:false,
            message:"Something wnet wrong while following a user !"
        })
    }
}


//unfollow
exports.unfollow = async(req, resp) => {
    try{
        const userId = req.verifiedUser.id;
        const fId = req.params.fId;

        if(!userId || !fId) {
            return resp.status(404).json({
                success:false,
                message:"Please fill all input fields"
            })
        }

        //geeting user details
        const userDetails = await User.findById(userId);
        console.log("userDetails are : ", userDetails);

        //getting followId from userDetails
        const followId = userDetails.follow;

        //in follow, find with followId -> a doc of this user shows the following and followers
        const followDetails = await Follow.findById(followId);
        console.log("followDetails are : ", followDetails);

        if(!followDetails){
            console.log("User neither have followers nor following anyone");

            return resp.status(404).json({
                success:false,
                message:"The user neither have followers nor follow any other"
            })
        }

        //removing this following from his list
        const updatedFollowDetails = await Follow.findByIdAndUpdate(followId, 
            {
                $pull: {
                    //iss fId user ko nikal do
                    following:fId,
                }
            },
            {new:true});
        console.log("updatedFollowDetails are : ", updatedFollowDetails);


        //also, updating the other person doc by removing the follower of this userId
        const followeeDetails = await User.findById(fId);
        const followeeId = followeeDetails.follow;

        const updatedFollowee = await Follow.findOneAndUpdate({_id:followeeId} , 
            {
                $pull: {
                    followers:userId,
                }
            },
            {new:true});

        return resp.status(200).json({
            success:true,
            message:"Unfollowed the user !",
            updatedFollowDetails: updatedFollowDetails,
            updatedOther: updatedFollowee,
        })
    }
    catch(error) {
        console.log("Error while unfollowing is : ", error.message);

        return resp.status(500).json({
            success:false,
            message:"Something went wrong while unfollowing the user"
        })
    }
}


//getAllFollowingOfUser 
exports.getAllFollowingOfUser = async(req, resp) => {
    try{
        const userId = req.verifiedUser.id;

        if(!userId) {
            return resp.status(404).json({
                success:false,
                message:"Input data is Missing !"
            })
        }

        const userDetails = await User.findById(userId)
                            .populate({
                                path:'follow',
                                populate:'following'
                            })
                            .exec();
        console.log("userDetails are in open following form : ", userDetails);

        const followingDetails = userDetails.follow.following;
        console.log("followingDetails are : ", followingDetails);

        return resp.status(200).json({
            success:true,
            message:"All following are given below : ",
            userDetails: userDetails,
            followingDetails: followingDetails,
        })
    }
    catch(error){
        console.log("Error while getting all followings of a user is : ", error.message);

        return resp.status(500).json({
            success:false,
            message:"Somethin went wrong while getting all followings of a user"
        })
    }
}


//getAllFollowersOfUser
exports.getAllFollowersOfUser = async(req, resp) => {
    try{
        const userId = req.verifiedUser.id;

        const userDetails = await User.findById(userId)
                            .populate({
                                path:'follow',
                                populate:'followers'
                            })
                            .exec();

        console.log("userDetails in open form are : ", userDetails);

        const followers = userDetails.follow.followers;
        console.log("followers are : ", followers);

        if(!followers) {
            return resp.status(404).json({
                success:false,
                message:"The user does not have any followers"
            })
        }

        return resp.status(200).json({
            success:true,
            message:"All followers are given below : ",
            userDetails: userDetails,
            followers: followers,
        })
    }
    catch(error){
        console.log("Error while getting all followers of a user : ", error.message);

        return resp.status(200).json({
            success:false,
            message:"Failure to get all followers of a user"
        })
    }
}