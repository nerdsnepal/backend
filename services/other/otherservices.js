const PasswordReset = require("../../models/password-reset-model")
const { generateCode } = require("../../common/utils")
const { sendPasswordResetCodeMail, sendPasswordResetLink } = require("../mail/sendmail")


const PasswordResetService = async(isEmail,user,isLink=false)=>{   
    try {
         //generate code 
        const genCode = generateCode(isLink?12:6)
        const timestamp =Date.now();
        const token = genCode+'.'+timestamp+'.'+user._id;
         await PasswordReset({
            userId:user,
            resetThrough:isEmail?"email":"username",
            resetCode:isLink?token:genCode
        }).save()
        if(isLink){
            await sendPasswordResetLink(user.email,user.name,token)
        }else{
            await sendPasswordResetCodeMail(user.email,user.name,genCode)
        }
        return  Promise.resolve(true)
    } catch (error) {
        console.log(error);
        return  Promise.reject(false)
    }
}
module.exports = {PasswordResetService}

