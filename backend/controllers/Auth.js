const User = require('../models/User');
const Profile = require('../models/Profile');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Follow = require('../models/Follow');

exports.signup = async(req, resp) => {
    try{
        let{firstName, lastName, email, password, confirmPassword} = req.body;

        if(!firstName || !lastName || !email || !password || !confirmPassword) {
            return resp.status(404).json({
                success:false,
                message:"Please enter all required input fields",
            })
        }

        const existingUser = await User.findOne({email});

        if(existingUser) {
            return resp.status(404).json({
                success:false,
                message:"The user is already registered",
                existingUser:existingUser,
            })
        }

        if(password !== confirmPassword) {
            return resp.status(404),json({
                success:false,
                message:"Password and Confrim Password does not matched!",
            })
        }

        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(error){
            return resp.status(404).json({
                success:false,
                message:"Error occured hasing the password"
            })
        }

        const profileDetails = await Profile.create({
            bio:null,
            profileImgUrl:null,
        });

        //initially, set the array undefined not as null
        const followDetails = await Follow.create({following:undefined, followers:undefined});
        console.log("follow details : ", followDetails);

        const user = await User.create({firstName, lastName, email, 
            password:hashedPassword,
            confirmPassword:hashedPassword,
            profile:profileDetails._id,
            follow:followDetails._id,
            });
        console.log("User is : ", user);

        return resp.status(200).json({
            success:true,
            message:"The user is registered successfully!",
            user: user,
        })

    }
    catch(error) {
        console.log("Error while sign up : ", error.message);

        return resp.status(500).json({
            success:false,
            message:'Something went wrong while signing up, check code or try again',
        })
    }
}

exports.login = async(req, resp) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return resp.status(404).json({
                success:false,
                message:"Please enter all input fields",
            })
        }

        const user = await User.findOne({email:email});

        if(!user) {
            return resp.status(404).json({
                success:false,
                message:"The user does not exists, Try to sign Up first",
            })
        }

        if(! await bcrypt.compare(password, user.password)){
            return resp.status(404).json({
                success:false,
                message:"Password is Invalid!"
            })
        }

        const payload = {
            id: user._id,
            email:user.email
        };

        const jwtToken = jwt.sign(payload, 
                process.env.JWT_SECRET,
                {
                    expiresIn:'2h',
                });
        
        user.password = undefined;
        user.confirmPassword = undefined;
        user.jwtToken = jwtToken;

        return resp.status(200).json({
            success:true,
            message:"The user is Logged In successfully",
            user: user,
            jwtToken: jwtToken,
        })
    }
    catch(error) {
        console.log("Error while loggin In : ", error.message);

        return resp.status(500).json({
            success:false,
            message:"Something went wrong while logging In, check code or try again",
        })
    }
}