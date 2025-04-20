const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username : {
        type : String,
        requrired : true,
        unique : true
    },
    fullname : { 
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        minlength : 8
    }, 
    followers : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            default : []
        }
    ],
    following : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            default : []
        }
    ],
    profileImg : {
        type : String,
        default : ''
    },
    coverImage : {
        type : String , 
        default : ''
    }, 
    bio : {
        type : String,
        default : ''
    },
    link : {
        type : String,
        defualt : ''
    }
} , {timestamps : true})


const User = mongoose.model("User" , UserSchema)

module.exports = User