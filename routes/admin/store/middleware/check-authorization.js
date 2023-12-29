
//all the permission is handle here 

const { USERTYPE, isEmpty } = require("../../../../common/utils")
const StoreModel = require("../model/storemodel")


const StoreAuthorization =async(req,res,next)=>{
    let {storeId} = req.method==='GET'?req.query:req.body 
    const {userId} = req.user 
    /*Now checking the user's is belong to the store or not if the user is not belong to the store then
    send the unauthorize response 
    */
    try {
        if(req.user.role===USERTYPE.SUPERUSER){
           return  next()
        }
        if(isEmpty(storeId)){
            return res.status(401).json({success:false,error:"StoreId is required"})
        }
        //first check the user's is merchant or not 
        if(await StoreModel.findOne({_id:storeId,merchantId:userId})){
            req.user.role = USERTYPE.MERCHANT
           return next()
        }
        if(await StoreModel.findOne({_id:storeId,empolyeeId:{$in:[userId]}})){
            req.user.role = USERTYPE.EMPLOYEE
            // get all the employee permission to access this store 
           return next()
        }
       return res.status(422).json({success:false,error:"Unauthorized user"})
    
    } catch (error) {
        return res.status(500).json({success:false,error:error})
    }
}


module.exports = {
    StoreAuthorization
}
