const express = require('express')
const { 
    registerUser,
    loginUser,
    getMe,
    updateDetails,
    logout,
    updatePassword
} = require('../controllers/auth')

const router = express.Router()
const { protect } = require('../middleware/auth')

router.post('/register', registerUser);
router.get('/logout', logout);
router.post('/login', loginUser);
router.put('/updatedetails',protect, updateDetails);
router.put('/updatepassword',protect, updatePassword);
router.get('/me', protect, getMe);

module.exports = router