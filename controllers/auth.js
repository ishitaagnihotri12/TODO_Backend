const User = require('../models/users')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')

// @desc    Register User
// @route   GET /api/v1/auth/register
// @access  Public 
exports.registerUser = asyncHandler(async (req,res,next)=>{
    const {name, email, password } = req.body

    // Create new User
    const user = await User.create({
        name,
        email, 
        password
    })

    // Create Token
    // const token = user.getSignedJwtToken()
    // res.status(200).json({success:true, msg:'User Registered',token:token})

    sendTokenResponse(user, 200, res)
})

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public 
exports.loginUser = asyncHandler(async (req,res,next)=>{
    const { email, password } = req.body

    // Validate Email and Password
    if(!email || !password){
        return next(new ErrorResponse('Please Provide an email and password',400))
    }

    // Check for User
    const user = await User.findOne({ email }).select('+password')

    if(!user){
        return next(new ErrorResponse('Invalid credentials ', 401))
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password)

    if(!isMatch){
        return next(new ErrorResponse('Invalid credentials',401))
    }
    // Create Token
    // const token = user.getSignedJwtToken()
    // res.status(200).json({success:true, msg:'User Logged In',token:token})
    sendTokenResponse(user, 200, res)
})

// Get token from the model, create cookies and send response
const sendTokenResponse = (user, statusCode, res)=>{
    // Create token
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIES_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure = true 
    }

    res.status(statusCode).cookie('token', token, options).json(
        {
            success: true,
            token,
            data:user
        }
    )
}

// @desc    Logout User / clear cookies
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req,res,next)=>{
    res.cookie('token', 'none',{
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({
        success : true,
        data: {}
    })
})

// @desc    Get Current logged in User
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req,res,next)=>{
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success : true,
        data: user
    })
})

// @desc    Update User Details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req,res,next)=>{

    const filedToUpdate = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, filedToUpdate, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success : true,
        data: user
    })
})


// @desc    Update Password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password')

    // Check current password
    if(!(await user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse('Password is incorrent', 401))
    }

    user.password = req.body.newPassword
    await user.save()

    sendTokenResponse(user, 200, res)
})