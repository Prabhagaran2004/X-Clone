const express = require('express')
const protectRoute = require('../middleware/protectRoute')
const { createPost } = require('../controllers/post.controller')
const router = express.Router()


router.post('/create' , protectRoute , createPost)
// router.post('/create' , protectRoute , likeUnlike)
// router.post('/create' , protectRoute , commentPost)
// router.post('/create' , protectRoute , deletePost)



module.exports = router