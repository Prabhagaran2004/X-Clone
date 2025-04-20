const express = require('express')
const router = express.Router()
const protectRoute = require("../middleware/protectRoute")
const {signup , login , logout , getMe} = require('../controllers/auth.controller')



router.post("/signup", signup )
router.post("/login", login )
router.post("/logout", logout )
router.get("/me" , protectRoute , getMe)


module.exports = router 