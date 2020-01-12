const express = require('express')
const { 
    createTodo,
    getTodos,
    updateTodo,
    deleteTodo
} = require('../controllers/todo')
const router = express.Router()

const { protect } = require('../middleware/auth')

router.post('/', protect, createTodo);
router.post('/gettodos', protect, getTodos);
router.put('/updatetodo/:id', protect, updateTodo);
router.delete('/:id', protect, deleteTodo);

// 
// router
//     .route('/') 
//     .post(protect, createTodo)
//     .post(protect, getTodos);

    
module.exports = router