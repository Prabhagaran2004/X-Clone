const express = require('express')
const protectRoute = require('../middleware/protectRoute')
const {
    getProfile,
    getFollowUnfollow
} = require("../controllers/user.controller")
const router = express.Router()

router.get("/profile/:username" , protectRoute , getProfile)
router.get("/follow/:id" , protectRoute , getFollowUnfollow)


module.exports = router 