const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = async(req, resp, next) => {
    try{
        const token = req.body.jwtToken ;

        if(!token) {
            return resp.status(404).json({
                success:false,
                message:"The Token is Missing!",
            })
        }

        try{
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            console.log("decodedToken: ", decodedToken);

            req.verifiedUser = decodedToken;

            next();
        }
        catch(error){
            console.log("Error occured while decoding token : ", error.message);

            return resp.status(404).json({
                success:false,
                message:"Error ocuured while decoding the Token",
            })
        }

    }   
    catch(error){
        console.log("Something went wrong while authentication");

        return resp.status(500).json({
            success:false,
            message:"Error occured while Authentication",
            error:error.message,
        })
    }
}