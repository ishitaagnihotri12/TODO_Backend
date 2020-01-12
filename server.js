const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const path = require('path');
const errorHandler = require('./middleware/error')
const cookiesParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')

const connectDB = require('./config/db')

// Custom Middleware
// const logger = require('./middleware/logger')

//connect to db
connectDB()

//load env file
dotenv.config({path:'./config/config.env'})

// Route Files
const auth = require('./routes/auth')
const todo = require('./routes/todo')

const app =  express()

// Body parser
app.use(express.json())

// Cookies Parser
app.use(cookiesParser())
// app.use(logger)

// Dev logging midleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// Sanitize data
app.use(mongoSanitize())

// Set Security Headers
app.use(helmet())

// Prevent XSS Attack
app.use(xss())

// Rate Limit
const limiter = rateLimit({
    windowMs: 10 *60 *1000, // 10 MIN
    max:100
})
app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Enable CORS
app.use(cors())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount route
app.use('/api/v1/auth', auth)
app.use('/api/v1/todos', todo)

 
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server  = app.listen(PORT, () => {
    console.log('App listening on env: '+process.env.NODE_ENV+' port : '+PORT);
});

// handle unhandled promise rejections
process.on('unhandledRejection',(err, promise)=>{
    console.log(`Error: ${err.message}`)
    //close server & exit process
    server.close(()=>{
        process.exit(1)
    })
})

