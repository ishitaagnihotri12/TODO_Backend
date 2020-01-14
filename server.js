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



connectDB()


dotenv.config({path:'./config/config.env'})


const auth = require('./routes/auth')
const todo = require('./routes/todo')

const app =  express()


app.use(express.json())


app.use(cookiesParser())

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}


app.use(mongoSanitize())


app.use(helmet())


app.use(xss())


const limiter = rateLimit({
    windowMs: 10 *60 *1000, // 10 MIN
    max:100
})
app.use(limiter)


app.use(hpp())


app.use(cors())


app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/auth', auth)
app.use('/api/v1/todos', todo)

 
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server  = app.listen(PORT, () => {
    console.log('App listening on env: '+process.env.NODE_ENV+' port : '+PORT);
});


process.on('unhandledRejection',(err, promise)=>{
    console.log(`Error: ${err.message}`)
    //close server & exit process
    server.close(()=>{
        process.exit(1)
    })
})

