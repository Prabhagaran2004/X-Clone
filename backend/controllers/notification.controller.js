const Notification = require("../models/notification.model");

const getNotification = async( req , res ) => {
    try {
        const userId = req.user._id
        const notification = await Notification.find({ to : userId}).populate({
            path : 'from',
            selected : 'username profileImg'
        })

        await Notification.updateMany({to : userId} , {read : true})
        res.status(200).json(notification)
    } catch (error) {
        console.log(`Error in get notification controller : ${error}`);
        return res.status(400).json({ error : "Internal server error "})
    }
}
const deleteNotification = async( req , res ) => {
    try {
        const userId = req.user._id
        await Notification.deleteMany({ to : userId})
        res.status(200).json({ message : "Notification deletes successfully"})
    } catch (error) {
        console.log(`Error in get notification controller : ${error}`);
        return res.status(400).json({ error : "Internal server error "})
    }
}


module.exports = {
    getNotification ,
    deleteNotification
}