const User = require('../models/user.model')
const bcrypt = require('bcryptjs');
const { link } = require('../routes/auth');

const signup = async(req ,res) => {
    try {
        const { username , fullname , email , password} = req.body;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if(!emailRegex.text(email)){
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
            await newUser.save()
            res.status(200).json({
                _id : newUser._id ,
                username : newUser.username ,
                fullname : newUser.fullname ,
                email : newUser.email ,
                followers : newUSer.followers,
                following : newUser.following,
                profileImg : newUser.profileImg,
                coverImg : newPUser.coverImg,
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
const login = (req ,res) => {
    res.send("login")
}
const logout = (req ,res) => { 
    res.send("logout")
}

module.exports = {signup , login , logout}