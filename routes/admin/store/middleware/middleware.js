const { isEmpty } = require("../../../../common/utils")
const StoreModel = require("../model/storemodel")

/* This middleware is use to check the required information is submitted or not */
const CreateStoreValidatorMiddleware =async (req,res,next)=>{
    const {name,merchantId}= req.body 
    let error = []
    if(isEmpty(name)){
        error.push("Name field can't be empty")
    }
    if(isEmpty(merchantId)){
        error.push("User ID can't be empty")
    }
    //check the store name is already used or not 
    if(await StoreModel.findOne({name})){
        error.push("Store name must be unique")
    }
    if(error.length>0){
        return res.status(200).json({success:false,error})
    }else{
        next()
    }
   
}

module.exports = {
    CreateStoreValidatorMiddleware
}
