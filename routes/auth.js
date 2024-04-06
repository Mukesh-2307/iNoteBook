const express = require('express');
const router = express.Router()
const User = require("../models/User")
const { body,validationResult } = require('express-validator');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const fetchuser = require("../middleware/fetchuser")
const JWT_SECRET = "theSecretCode"

//Route 1: creating a user using: POST "/api/auth" and doesn't require auth 
router.post('/createuser',[
    body('name').isLength({min: 4}),
    body('email').isEmail(),
    body('password').isLength({min: 4})
],async (req,res)=>{
    let success = false
    // console.log(req.body+ "op of line 17");
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }
    try{
        let user = await User.findOne({email: req.body.email});
        // console.log(user+ "op of line 24")
        if(user){
            success = false
            return res.status(400).json({success,error: "sorry email already exist"})
        }
        const salt = await bcrypt.genSalt(10)
        // console.log(salt+ "op of line 30")
        secPass = await bcrypt.hash(req.body.password,salt)
        // console.log(secPass+ "op of line 32")
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })
        const data = {
            user:{
                id: user.id
            }
        }
        // console.log(data + "op of line 43")
        success = true
        // console.log(JWT_SECRET + "op of line 45")
        const token = jwt.sign(data,JWT_SECRET)
        // console.log(token+ "op of line 47")
        res.json({success,token}); // passed as response


    } catch(error){
        console.error(error.message)
        res.status(500).json({error: "some error occured"})
    }
})

//Route 2: checking user creds using: POST "/api/auth"
router.post('/login',[
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password cannot be blank').exists()
],async (req,res)=>{
    let success = false
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }
    const {email, password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "sorry login with correct creds"})
        }
        const passwordCheck = await bcrypt.compare(password, user.password)
        if(!passwordCheck){
            success = false
            return res.status(400).json({success,error: "sorry login with correct creds"})
        }

        const payload = {
            user:{
                id: user.id
            }
        }
        success = true
        const token = jwt.sign(payload,JWT_SECRET)
        res.json({success,token});

    } catch(error){
        console.error(error.message)
        res.status(500).json({error: "some error occured"})
    }
})

//Route 3: get user's details using: POST "/api/auth"
router.post('/getuser',fetchuser,async (req,res)=>{
    try {
        let userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "some error occured"})
    }
})

module.exports = router