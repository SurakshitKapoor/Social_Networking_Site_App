const User = require('../models/User');
const Profile = require('../models/Profile');

exports.updateProfile = async(req, resp) => {

    try{
        const userId = req.verifiedUser.id;

        const {bio, profileImgUrl} = req.body;

        if(!userId) {
            return resp.status(404).json({
                success:false,
                message:"The userId is Missing !",
            })
        }

        const user = await User.findById(userId);
        console.log("user is : ", user);

        const profileId = user.profile;
        console.log("profileId is : ", profileId);

        const updatedProfile = await Profile.findByIdAndUpdate(profileId,
            {
                    bio,
                    profileImgUrl,

            },
            {new:true});
        console.log("profile details are : ", updatedProfile);

        return resp.status(200).json({
            success:true,
            message:"Profile is updated successfully!",
            updatedProfile: updatedProfile,
        })

    }
    catch(error) {
        console.log("Error while updating Profile is : ", error.message);

        return resp.status(500).json({
            success: false,
            message: "Error occured while updating profile"
        })
    }
}