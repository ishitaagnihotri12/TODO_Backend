const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true,'Please add a Name'],
    },
    done: {
        type:Boolean
    },
    uid: {
        type:String,
        required:[true,'Please add a UserID'],
    },
    createdAt:{
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('ToDo',todoSchema)