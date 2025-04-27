const express = require('express')
const protectRoute = require('../middleware/protectRoute')
const { createPost , deletePost , commentPost } = require('../controllers/post.controller')
const router = express.Router()


router.post('/create' , protectRoute , createPost)
// router.post('/create' , protectRoute , likeUnlike)
router.post('/comment/:id' , protectRoute , commentPost)
router.delete('/:id' , protectRoute , deletePost)



module.exports = router