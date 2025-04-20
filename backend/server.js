const express = require('express')
const dotenv = require('dotenv')
const app = express()
const authRoute = require('./routes/auth')
const connectDb = require('./db/connectDb')
const cookieParser = require("cookie-parser")
const userRoute = require('./routes/route')

dotenv.config()
const PORT = process.env.PORT;


app.use(express.json())

app.use(cookieParser())
app.use('/api/auth' , authRoute)
app.use('/api/users' , userRoute)

 

app.listen(PORT , () => {
    console.log(`Server is running ${PORT}`);
    connectDb()
})
