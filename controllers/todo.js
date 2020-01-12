const Todo = require('../models/todo')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')

// @desc    Create new Todo
// @route   POST /api/v1/todo/:id
// @access  Private 
exports.createTodo = asyncHandler(async (req,res,next)=>{
    // console.log(req.body)
    const todo = await Todo.create(req.body)
    res.status(201).json({
        success:true,
        data: todo
    })
})

// @desc    Get all Todos with auth
// @route   POST /api/v1/todos/gettodos
// @access  Private 
exports.getTodos = asyncHandler(async (req,res,next)=>{
    console.log(req.body.uid)
    const todos = await Todo.find({uid:req.body.uid})       
    res.status(200).json({success:true,count:todos.length,data:todos})
    // res.status(200).json({success:true,msg:'Show ALL Projects',hello:req.hello})
})

// @desc    Update Todo
// @route   PUT /api/v1/todos/updatetodo/:id
// @access  Private 
exports.updateTodo = asyncHandler(async (req,res,next)=>{
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    })  
    if(!todo){
        // return res.status(400).json({success:false}) 
        return next(new ErrorResponse(`Todo not found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({success : true, data : todo})
})

// @desc    Delete Todo
// @route   DELETE /api/v1/todos/:id
// @access  Private 
exports.deleteTodo = asyncHandler(async (req,res,next)=>{
    const todo = await Todo.findByIdAndDelete(req.params.id)  
    if(!todo){
        // return res.status(400).json({success:false}) 
        return next(new ErrorResponse(`Todo not found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({success : true, data : {}})
})