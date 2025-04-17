const mongoose = require('mongoose')


const connectDb = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongo DB connected");
    }
    catch(err){
        console.log(`Error in connecting DB : ${err}`);
        process.exit(1)
    }
}

module.exports = connectDb;