const express = require('express')
const dotenv = require('dotenv')
const app = express()
const authRoute = require('./routes/auth')
const connectDb = require('./db/connectDb')
const cookieParser = require("cookie-parser")
const userRoute = require('./routes/route')
const postRoute = require('./routes/post')  
const cloudinary = require('cloudinary')
const notificationRoute = require('./routes/notification')

dotenv.config()
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME , 
    api_key : process.env.API_KEY,
    api_secret : process.env.API_SECRET_KEY
})


const PORT = process.env.PORT;


app.use(express.json())

app.use(cookieParser())
app.use('/api/auth' , authRoute)
app.use('/api/users' , userRoute)
app.use('/api/posts' , postRoute)
app.use('/api/notification' , notificationRoute)

 

app.listen(PORT , () => {
    console.log(`Server is running ${PORT}`);
    connectDb()
})
