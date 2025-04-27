const User = require("../models/user.model")
const cloudinary = require('cloudinary')
const Post = require('../models/post.model')

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createPost = async( req, res) => {
    try {
		const { text } = req.body;
		let { img } = req.body;
		const userId = req.user._id.toString();

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if (!text && !img) {
			return res.status(400).json({ error: "Post must have text or image" });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newPost = new Post({
			user: userId,
			text : text,
			img : img || "",
		});

		await newPost.save();
		res.status(201).json(newPost);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
		console.log("Error in createPost controller: ", error);
	}
}

const deletePost = async(req , res) => {
    try {
        const {id} = req.params

        const post = await User.findOne({ _id : id})
        if(!post){
            return res.status(404).json({ error : "Post not found"})
        }

        if( post.user.toString() !== req.user._id.toString()){
            res.status(401).json({ error : "You are not authorised"})
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0]
            await cloudinary.destroy(imgId)
        }

        await Post.findByIdAndDelete({ _id : id})

        res.status(200).json({ message : "Post deleted successfully"})
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
		console.log("Error in delete controller: ", error);
    }
}

const commentPost = async(req , res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
		console.log("Error in Comment controller: ", error);
    }
}
module.exports = {
    createPost,
    deletePost
}