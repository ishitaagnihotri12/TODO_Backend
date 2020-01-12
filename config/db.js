const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path:'./config/config.env'})

const connectDB = async ()=>{
    // console.log(process.env.NODE_ENV)
    // console.log(process.env.MONGO_URI)
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology:true
    }).catch(e=>{
        console.log(e)
    })

    console.log('Mongodb connected: '+conn.connection.host)
}

module.exports = connectDB