/*
 This middleware is use to know the email-login is done through 
 email or username and also check if the given email or username is valid or not
 if not then it response as a failure 
 otherwise it will procceed next step

*/

const { emailValidator, validateUserName, isSuperUser } = require("../common/utils")
const AuthMiddleware = (req,res,next)=>{
    const {username,email} = req.body 
    let isEmail =null 
    if(username)isEmail=false 
     if(email)isEmail = true
     let error = []
     try {
        if(isEmail===null)error.push("email or username field can't be empty")
        if(error.length>0)throw new Error("Error")
        if(isEmail) {if(!emailValidator(email))error.push("Invalid email")}
        else if(!validateUserName(username)) error.push("Invalid username")
        if(error.length>0)throw new Error("Error")
         req.body.isEmail = isEmail 
         next()
     } catch (err) {
       return res.status(201).json({success:false,error})
     
     }

    
}

/*
hasPermissionMiddleware: 
Check the user privilege to do some particular action in the collection
For example: The employee may or may not have to doing some action in some collection 


*/

const hasPermissionMiddleware = (collectionName,action)=>{
    return async(req,res,next)=>{
        const {created_by} = req.body
        const {userId,userType} = req.user
        if(isSuperUser(userType)){
            req.hasAccess = true 
            return next()
        }
        try {
        //   await PrivilegeModel.findOne({
        //        created_by:created_by
        //    })
        } catch (error) {
            
        }

    }
}

module.exports = AuthMiddleware
