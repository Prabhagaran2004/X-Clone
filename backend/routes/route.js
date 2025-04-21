const express = require('express')
const protectRoute = require('../middleware/protectRoute')
const {
    getProfile,
    getFollowUnfollow,
    getSuggested
} = require("../controllers/user.controller")
const router = express.Router()

router.get("/profile/:username" , protectRoute , getProfile)
router.post("/follow/:id" , protectRoute , getFollowUnfollow)
router.get("/suggested" , protectRoute , getSuggested)


module.exports = router 