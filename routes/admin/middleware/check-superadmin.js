const { USERTYPE } = require("../../../common/utils")
const userModel = require("../../../models/user-model")
/*
This middleware check whether the user is admin or not
If the user is not admin then it send failure response, otherwise 
it call the next() request
*/

const CheckSuperAdmin =async(req,res,next)=>{
    const {role}= req.user 
    // first check the user is super-admin or not 
    try {
        //const user = await userModel.findOne({_id:userId})
        if(role===USERTYPE.SUPERUSER){
            next()
        }else{
            throw new Error("You're not authorized user")
        }
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Unauthorized user"
        })
    }
}

module.exports= CheckSuperAdmin