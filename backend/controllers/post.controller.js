const User = require("../models/user.model")
const cloudinary = require('cloudinary')
const Post = require('../models/post.model')

const createPost = async( req, res) => {
    try {
        const { text } = req.body
        let { img } = req.body
        const userId = req.user._id.toString()
        const user = await User.findOne({_id : userId})

        if(!user) {
            return res.status(400).json({ error : " User not found "})
        }

        if (!text && !img){
            return res.status(400).json({error : "Post must have text and image"})
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url
        }

        const newPost = new Post({
            user : userId , 
            text : text,
            img
        })

        await newPost.save()
        res.status(200).json(newPost)

    } catch (error) {
        console.log(`Error in Post controller ${error}`); 
        res.status(500).json({error : "Internal server error"})
    }
}

module.exports = {
    createPost
}