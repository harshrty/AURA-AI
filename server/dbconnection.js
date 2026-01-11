const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn =  await mongoose.connect(process.env.MONGO_URI)
        console.log("db connected")
    } catch (error) {
        console.error(`ERROR : ${error.message}`);
    }
}

module.exports = connectDB