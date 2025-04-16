const express = require('express')
const dotenv = require('dotenv')
const app = express()
const authRoute = require('./routes/auth')

dotenv.config()
const PORT = process.env.PORT;


app.use('/api/auth' , authRoute)
app.get('/' , (req , res) => {
    res.send("Home")
})


app.listen(PORT , () => {
    console.log(`Server is running ${PORT}`);
})