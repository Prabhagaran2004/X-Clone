const User = require("../models/user.model");

const getProfile = async(req , res) => {
    try {
        const { username } = req.params
        const user = await User.findOne({username})

        if(!user){
            return res.status(404).json({message : "User not found"})
        }

        res.status(200).json(user)
    } catch (error) {
        console.log(`Error in Get profile controller ${error}`);
        res.status(500).json({error : "Internal server error"})
    }
}

const getFollowUnfollow = async(req , res) => {
    try {
        
    } catch (error) {
        console.log(`Error in Get Follow controller ${error}`);
        res.status(500).json({error : "Internal server error"})
    }
}



module.exports = {
    getProfile,
    getFollowUnfollow
}