const UserValidationChecker = require("../../middleware/create-user-middleware")
const EmailVerifier = require("../../models/email-verifier-model")
const User = require("../../models/user-model")
const { sendVerificationMail } = require("../../services/mail/sendmail")
const { isEqual, encryptPassword, generateCode, USERTYPE } = require("../../common/utils")


const router = require("express").Router()

router.post("/super-user",UserValidationChecker,async(req,res)=>{
    const {fullname,username,email,password} = req.body
    const apiKey = req.header('super-user-api-key')
    try {
        if(!isEqual(apiKey,process.env.SUPER_USER_CREATE_AUTH_KEY))throw new Error("Invalid apikey")
        const currentUser= await new  User({name:fullname,
            username:username,email:email,password:await encryptPassword(password),metaData:{},
            role:USERTYPE.SUPERUSER
        }).save()
        if(currentUser){
            const code = generateCode(6)
            const emailVerifier = await new EmailVerifier({userId: currentUser,code}).save()
            await sendVerificationMail(email,fullname,code)
            const {confirmPassword,password,...other} =req.body
           return res.status(200).json({success:true,userDetails:other,isSendVerificationMail:emailVerifier!=null?true:false})
        }
    } catch (error) {
        console.log(error);
       return res.status(201).json({success:false,...error})
    }
})





module.exports = router

