const User = require("../models/user.model")
const cloudinary = require('cloudinary').v2
const Post = require('../models/post.model');
const Notification = require("../models/notification.model");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Post
const createPost = async (req, res) => {
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
            text: text,
            img: img || "",
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in createPost controller: ", error);
    }
};

// Delete Post
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorised" });
        }

        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(id);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in deletePost controller: ", error);
    }
};

// Comment on Post
const commentPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if (!text) {
            return res.status(400).json({ error: "Comment is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const comment = {
            user: userId,
            text
        };

        post.comments.push(comment);
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in commentPost controller: ", error);
    }
};

const likeUnlike = async (req, res) => {
    try {
        const userId = req.user._id
		const { id : postId }  = req.params
		const post = await Post.findOne({ _id : postId})
		if(!post){
			return res.status(404).json({ error : "Post not found"})
		}
		const likedPost = post.likes.includes(userId)
		if(likedPost){
			await Post.updateOne( { _id : postId} , { $pull : {likes : userId} } )
            await User.updateOne({ _id : userId} , {$pull : { likedPosts : postId}})
			res.status(200).json({ message : "Post unliked successfully"})
		}else{
			post.likes.push(userId)
            await User.updateOne({ _id : userId} , { $push : {likedPost : postId}})
			await post.save()

			const notification = new Notification({
				from : userId,
				to : post.user,
				type : "like"
			})
			await notification.save()
			res.status(200).json({ message : "Post liked successfully"})
		}
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in Like and Unlike controller: ", error);
    }
};

const getAllPosts = async( req , res ) => {
    try {
        const posts = await Post.find().sort({createdAt : -1}).populate({
            path : 'user',
            select : "-password"
        }).populate({
            path : 'comments.user',
            select : "-password"
        })
        if(posts.length === 0 ){
            return res.status(200).json([])
        }
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error in All posts controller: ", error);
    }
}
 
const getLikedPosts = async( req, res ) => {
    const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(likedPosts);
	} catch (error) {
		console.log("Error in getLikedPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
}


const getFollowingPost = async( req ,res ) => {
    try {
        
    } catch (error) {
        console.log("Error in following post controller: ", error);
		res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    createPost,
    deletePost,
    commentPost,
    likeUnlike,
    getAllPosts,
    getLikedPosts,
    getFollowingPost
};
