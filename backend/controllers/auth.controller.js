const User = require('../models/user.model')
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken')

const signup = async(req ,res) => {
    try {
        const { username , fullname , email , password } = req.body;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!emailRegex.test(email)){
            return res.status(400).json({message : "Invalid email"})
        }

        const existingemail = await User.findOne({email : email})
        const existingusername = await User.findOne({username : username})

        if(existingemail || existingusername){
            return res.status(400).json({error : "Already Existing User or Email"})
        }

        if(password.length < 8){
            return res.status(400).json({error : "Password should be more than 8 characters"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password , salt)

        const newUser = new User({
            username , fullname , email , password : hashedPass
        })

        if(newUser){
            generateToken(newUser._id , res)
            await newUser.save()
            res.status(200).json({
                _id : newUser._id ,
                username : newUser.username ,
                fullname : newUser.fullname ,
                email : newUser.email ,
                followers : newUser.followers,
                following : newUser.following,
                profileImg : newUser.profileImg,
                coverImg : newUser.coverImg,
                bio : newUser.bio,
                link : newUser.link
            })
        }
        else{
            res.status(400).json({error : "Invalid User data"})
        }


    } catch (error) {
        console.log(`Error in connecting DB : ${error}`)
        res.status(500).json({error : "Internal Server Error"})
    }
}
const login = async(req ,res) => {
    try {
        const { username , password } = req.body
        const user = await User.findOne({username})
        const isPasswordCorrect = await bcrypt.compare(password , user.password || "")

        if( !user || !isPasswordCorrect ){
            return res.status(400).json({error : "Incorrect Email or Password..."})
        }
    
        generateToken(user._id , res)
        
        res.status(200).json({
            _id : user._id ,
            username : user.username ,
            fullname : user.fullname ,
            email : user.email ,
            followers : user.followers,
            following : user.following,
            profileImg : user.profileImg,
            coverImg : user.coverImg,
            bio : user.bio,
            link : user.link
        })

    } catch (error) {
        console.log(`Error in connecting DB : ${error}`)
        res.status(500).json({error : "Internal Server Error"})
    }
}
const logout = async(req ,res) => { 
    try {
        res.cookie("jwt" , "" , { maxAge : 0 })
        res.status(200).json({ message : "Logout successfully"})
    } catch (error) {
        console.log(`Error in connecting DB : ${error}`)
        res.status(500).json({error : "Internal Server Error"})
    }
}

module.exports = {signup , login , logout}