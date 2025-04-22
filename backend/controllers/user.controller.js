const Notification = require("../models/notification.model");
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
        const { id } = req.params
        const userModify = await User.findById({ _id : id })
        const currentUser = await User.findById({ _id : req.user._id})

        if( id === req.user._id){
            return res.status(400).json({ error : "You cannot follow/unfollow yourself..."})
        }

        if(!userModify || !currentUser){
            return res.status(400).json({ error : "User not found"})
        }

        const isFollowing = currentUser.following.includes(id)

        if(isFollowing){
            //Unfollow
            await User.findByIdAndUpdate( {_id : id} , { $pull : { followers : req.user._id } } )
            await User.findByIdAndUpdate( {_id : req.user._id} , { $pull : { following : id } } )
            res.status(200).json({ message : "Unfollow successfully"})
        }
        else{
            //Follow
            await User.findByIdAndUpdate( {_id : id} , { $push : {followers : req.user._id} } )
            await User.findByIdAndUpdate( {_id : req.user._id} , { $push : { following : id } } )
            const newNotification = new Notification({
                type : "follow",
                from : req.user._id,
                to : userModify._id
            })
            await newNotification.save()
            res.status(200).json({ message : "Follow successfully"})
        }
 
    } catch (error) {
        console.log(`Error in Get Follow controller ${error}`); 
        res.status(500).json({error : "Internal server error"})
    }
}  

const getSuggested = async(req , res) => {
        try {
            const userId = req.user._id;
            const usersFollowedByMe = await User.findById(userId).select("following");
            const users = await User.aggregate([
                {
                    $match: {
                    _id: { $ne: userId },
                },
            },
            { $sample: { size: 10 } }, 
        ]);
        const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 4);
    
        suggestedUsers.forEach((user) => (user.password = null));
    
        res.status(200).json(suggestedUsers);
    } catch (error) {
        console.log("Error in getSuggestedUsers: ", error.message);
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    getProfile,
    getFollowUnfollow,
    getSuggested
}