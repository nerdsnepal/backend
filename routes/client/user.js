
const { HandleEmailPasswordReset, HandleUsernamePasswordReset, VerifyCode, ResetPassword, EmailVerifyCode } = require("../../middleware/handle-password-reset");
const AuthMiddleware = require("../../middleware/auth-middleware");
const UserValidationChecker = require("../../middleware/create-user-middleware");
const EmailVerifier = require("../../models/email-verifier-model");
const User = require("../../models/user-model");
const { generateCode, encryptPassword, url } = require("../../common/utils");
const userModel = require("../../models/user-model");
const { PasswordResetService } = require("../../services/other/otherservices");
const passwordResetModel = require("../../models/password-reset-model");
const { generateAuthToken, AuthenticationToken } = require("../../middleware/auth-token");
const UserC = require("../../controller/user_controller");
const { sendVerificationMail } = require("../../services/mail/sendmail");



const app = require("express").Router()

app.post("/create-user",UserValidationChecker,async(req,res)=>{
    
    const {fullname,username,email,password} = req.body
    try {
        const currentUser= await new  User({name:fullname,
            username:username,email:email,password:await encryptPassword(password),metaData:req.meta}).save()
        if(currentUser){
            const code = generateCode(6)
            const emailVerifier = await new EmailVerifier({userId: currentUser,code}).save()
            await sendVerificationMail(email,fullname,code)
            const {confirmPassword,password,...other} =req.body
           return res.status(200).json({success:true,userDetails:other,isSendVerificationMail:emailVerifier!=null?true:false,message:"Thanks for creating your account. Please verify your email."})
        }
    } catch (error) {
        
       return res.status(201).json({success:false,...error})
    }
})
app.get('/user',AuthenticationToken,UserC.getUser)

/*
Used to reset password of the user
Reset Password By: username or email 

*/
app.post("/send-verification-code",async(req,res)=>{
    
    const {email} = req.body;
    try {
        const currentUser= await userModel.findOne({email:email})
        if(currentUser){
            const code = generateCode(6)
            const emailVerifier = await new EmailVerifier({userId: currentUser,code}).save()
            await sendVerificationMail(email,currentUser.username,code)
           return res.status(200).json({success:true,isSendVerificationMail:emailVerifier!=null?true:false,message:emailVerifier!=null?"Email verification code sent.":"Failed"})
        }
    } catch (error) {
       return res.status(201).json({success:false,error:error.message})
    }
})

app.post("/reset-password",AuthMiddleware,HandleEmailPasswordReset,HandleUsernamePasswordReset)
app.post("/verify/reset-code",AuthMiddleware,VerifyCode)
//to verify email address
app.post("/verify/email-code",async(req,res)=>{
    const {email,code}= req.body
    try {
    const currentUser= await userModel.findOne({email:email})
    const currentDate =Date.now()
    const result =await EmailVerifier.findOne({userId:currentUser._id,code,expire_date:{$gte:currentDate}})
    if(result){
        await userModel.updateOne({email},{isVerified:true});
       return res.status(200).json({success:true,message:"Your email address has been verified."})
    }
    return res.status(422).json({success:false,message:"Oops. The verification code seems to be incorrect"})
    } catch (error) {
        //console.log(error);
       return res.json({success:false,message:"Something went wrong"}) 
    }
})


app.patch("/reset-password/change",ResetPassword)
app.get('/send-reset-link',async(req,res)=>{
    const {email} = req.query
    try {
        const user =  await userModel.findOne({email})
        if(!user){
            throw new Error("Enter a valid email address")
        }
       const result = await  PasswordResetService(true,user,true)
        return res.status(200).json({success:result,message:result?"Email has been sent! Please check your mail.":"Looks like you have either entered wrong email address or the email has not been registered yet."});
    } catch (error) {
        return res.status(501).json({success:false,error:"Looks like you have either entered wrong email address or the email has not been registered yet."})
    } 
})
app.get('/verify-code',async(req,res)=>{
    const {token} = req.query 
    //const url = `${req.protocol}://${req.headers.host}`;
    let resetToken =null 
    let expire = false 
    try {
        const result = await passwordResetModel.findOne({resetCode:token})
        if(result){
            await passwordResetModel.updateOne({_id:result._id},{isCodeUsed:true});
            const currentDate = Date.now();
            console.log(Date.now());
            const expire_date = new Date(result.expire_date).getTime()
            if(currentDate<expire_date){
               expire = true
            }
            const userId = result.userId
            resetToken = generateAuthToken({token,userId},'5min')
            const _update = await passwordResetModel.updateOne({resetCode:token},{
                passwordResetToken:resetToken
            })
            if(_update){expire=false}else{expire=true}
        }
    } catch (error) {
        expire = true 
    }finally{
   
        return res.status(200).json({
            success:true,
            isExpire:expire,
            resetToken:expire?null:resetToken
        })
    }
})

app.get("/user-email",async(req,res)=>{
    try {
        const {email}= req.query;
        if(await User.findOne({email:email})){
            return res.status(200).json({status:true,message:"Found!!!"});
        }else{
            throw new Error("User not found");
        }
    } catch (error) {
        return res.status(422).json({status:false,error:error.message})
    }
})
app.post("/address",AuthenticationToken,UserC.addAddress);
app.patch("/address",AuthenticationToken,UserC.updateAddress);
app.delete("/address",AuthenticationToken,UserC.deleteAddress);
app.patch("/user",AuthenticationToken,UserC.updateUserInfo);
module.exports = app