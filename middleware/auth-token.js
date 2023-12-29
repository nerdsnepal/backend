const jwt = require("jsonwebtoken")
const { isEmpty } = require("../common/utils")



// generate webtoken 
const generateAuthToken = (user,expireIn='48h')=>jwt.sign(user,process.env.SECRET_KEY, { expiresIn: expireIn})

// generate password reset token 
const passwordResetToken = (data,expireIn='5m')=>jwt.sign(data,process.env.RESET_KEY, { expiresIn: expireIn})

const AuthenticationToken = (req,res,next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] || req.cookies['token']
    if(isEmpty(token))
       return res.status(422).json({success:false,type:"token_empty",message:"Invalid Token"})
        jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{
        if(err) {
            return res.status(401).json({success:false,type:"Error",message:err})
        }
        req.user = user
        next()
    })
}

const VerifyTokenAndGetUser = (req,res,next)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] || req.cookies['token']
    if(isEmpty(token)){
            req.user ={}
            next()
            return
        }
        jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{
        if(err) {
            req.user ={}
            next()
            return
        }
        req.user = user
        next()
    })
}



module.exports = {generateAuthToken,AuthenticationToken,VerifyTokenAndGetUser}