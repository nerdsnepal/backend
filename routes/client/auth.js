/* login or authenticate the user by
email or username and password 
*/
const app  = require("express").Router()
const AuthMiddleware = require("../../middleware/auth-middleware")
const { generateAuthToken } = require("../../middleware/auth-token")
const User = require("../../models/user-model")
const { comparePassword, isEmpty } = require("../../common/utils")

app.post("/email-login",AuthMiddleware,async(req,res)=>{
   
     let {username,email,password,isEmail} = req.body
    // console.log(req.body);
     try {
        if(isEmpty(password))throw new Error("password field can't be empty")
        let currentUser = null 
        if(isEmail){
        currentUser= await User.findOne({email})
        }else{
            currentUser= await User.findOne({username})
        }
        if(currentUser===null) {
            res.status(201).json({success:false,isLogin:false,message:"Invalid credentials"})
            return
        }
        if(await comparePassword(password,currentUser.password)){
            let token = generateAuthToken({userId:currentUser._id,username:currentUser.username,
               email:currentUser.email,role:currentUser.role},'30d')
                const cookieOptions = {
                expires: new Date(Date.now() + 30 * 60 * 60 * 24), 
                httpOnly: true, // prevents JavaScript from accessing the cookie
                secure:true,
                sameSite: "none",
              }; 
              currentUser.password = undefined
            res.cookie('token',token,cookieOptions)
            res.setHeader('Access-Control-Allow-Credentials',true)
            res.status(200).json({success:true,isLogin:true,message:"Successully login",token,user:currentUser})
            res.end()
        }else{
            res.status(201).json({success:false,isLogin:false,message:"Invalid credentials"})
        }
     } catch (err) {
        console.log(err);
        res.status(500).json({success:false,isLogin:false,message:"Server error"})
     }
    
})


module.exports = app 

