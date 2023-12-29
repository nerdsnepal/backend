
const { USERTYPE, SUBSCRIPTIONLEVEL, SUBSCRIPTIONMODEL, isEmpty } = require("../../../common/utils")
const Store = require("../../../controller/store")
const { AuthenticationToken } = require("../../../middleware/auth-token")
const userModel = require("../../../models/user-model")
const CheckSuperAdmin = require("../middleware/check-superadmin")
const { StoreAuthorization } = require("./middleware/check-authorization")
const { CreateStoreValidatorMiddleware } = require("./middleware/middleware")
const { StockLocationRequiredFieldChecker } = require("./middleware/store-location")
const StoreModel = require("./model/storemodel")

const router = require("express").Router()

// for creating store to the user 
router.post("/create",AuthenticationToken,CheckSuperAdmin,CreateStoreValidatorMiddleware,async(req,res)=>{
    const {userId} = req.user 
    const {name,merchantId}= req.body

    try {
        //create a store 
    await new StoreModel({created_by: userId,name,merchantId,subscriptionDetails:{
        paymentMethod:"None",
        subscribed_date:Date.now(),
        expire_on:null,
        isExipre:false,
        subscriptionLevel:SUBSCRIPTIONLEVEL.Basic,
        subscriptionModel:SUBSCRIPTIONMODEL.Freemium
    }}).save()
    // update user to merchant
    if(userId!==merchantId){
    await userModel.updateOne({_id:merchantId},{role:USERTYPE.MERCHANT}) 
    } 

    res.json({success:true,message:"Store Created Successfully"})
    } catch (error) {
        console.log(error);
        res.status(200).json({success:false,error:"Failed to create store"})
    }
})

/*get all the stores information 
only accessible to the super user 

*/
router.get("/",AuthenticationToken,async(req,res)=>{
    const {userId,role}= req.user
    try {
        let stores = null
        if(role===USERTYPE.SUPERUSER){
            stores = await StoreModel.find()
        }else{
            stores = await StoreModel.find({merchantId:userId})
        }
        stores.map((store)=>{
            //store.created_by=undefined
            //store.emails= undefined 
            //store.websiteLayout = undefined
            //store.paymentMethod = undefined
            //store.subscriptionDetails = undefined 

        })
        res.status(200).json({success:true,stores})
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
})

router.get("/storeId",AuthenticationToken,StoreAuthorization,async(req,res)=>{
    const {storeId} = req.query 
    if(isEmpty(storeId)){
        return res.status(422).json({success:false,message:"StoreId is not valid"})
    }
    try {
        const store = await StoreModel.findOne({_id:storeId})
        store.websiteLayout=undefined 
        return res.status(200).json({
            success:store!==null,store
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
})


router.get("/:merchantId",AuthenticationToken,CheckSuperAdmin,async(req,res)=>{
    const merchantId = req.params.merchantId
    try {
       const stores = await StoreModel.find({merchantId:merchantId})
       res.status(200).json({success:true,stores})
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Invalid merchant id"
        }) 
    }
})

//
router.post("/stocklocation",AuthenticationToken,StoreAuthorization,StockLocationRequiredFieldChecker,async(req,res)=>{
    const {country,state,city,
        postalCode,addressLine1,
        addressLine2,geocoordinate,storeId} = req.body 
    const {userId,role} = req.user 
    let canAccess = true  
    try {
        if(canAccess){
            //insert the new store location 
            const stockLocation = {created_by:userId,
                country,state,city,postalCode,addressLine1,addressLine2,geocoordinate
            }
            await StoreModel.updateOne({_id:storeId}, { $push: { stockLocation: stockLocation}} )
            return res.status(200).json({success:true,message:"Saved"})   
            }else{
                return res.status(422).json({success:false,message:"You aren't authorized to access this section"})
            }
    } catch (error) {
        return res.status(500).json({success:false,error})
    }

})

router.patch("/stocklocation",AuthenticationToken,StoreAuthorization,async(req,res)=>{
    const {stockLocation,storeId} = req.body 
    const {userId,role} = req.user 
    let canAccess = true   
    try {
            //check required fields 
            let isvalid = true 
            for (const location of stockLocation) {
                if(isEmpty(location.country) && isEmpty(location.city) && isEmpty(location.state)){
                    isvalid = false 
                    break
                }
            }
            if(!isvalid){
                return res.status(422).json({success:false,error:"Country, state, city are required fields."})
            }
            if(canAccess){
                //insert the new store location 
                const updateHistory = {updated_by:userId,updated_date:Date.now(),remarks:"Stock location changed into "+stockLocation}
                await StoreModel.updateOne({_id:storeId}, {  stockLocation: stockLocation,$push:{updateHistory:updateHistory}} )
                return res.status(200).json({success:true,message:"Updated"})
                
            }else{
                return res.status(422).json({success:false,message:"You aren't authorized to access this section"})
            }
    } catch (error) {
        return res.status(500).json({success:false,error})
    }

})

router.patch("/about",AuthenticationToken,StoreAuthorization,async(req,res)=>{
    const {about,storeId} = req.body  
    try {
         await StoreModel.updateOne({_id:storeId}, {about} )
         return res.status(200).json({success:true,message:"Updated"})   
    } catch (error) {
        return res.status(500).json({success:false,error:error.message})
    }
})

// update 
router.patch("/name",AuthenticationToken,StoreAuthorization,async(req,res)=>{
    const {userId,role} = req.user 
    const {name,storeId} = req.body  
    if(isEmpty(name)){
        return res.status(422).json({
            success:false,message:"Store name can't be empty"
        })
    }
    if(name.length<=3){
        return res.status(422).json({
            success:false,message:"Store name length must be greater than or equal to 3"
        })
    }
    try {
        const duplicatename = await StoreModel.findOne({name:name.trim().toLowerCase()}) 
        if(duplicatename){
            return res.status(422).status({
                success:false,
                message:"Store name already exists"
            })
        }
        const updateHistory = {updated_by:userId,updated_date:Date.now(),remarks:"Name changed into "+name}
        const result = await StoreModel.updateOne({_id:storeId},{name:name.trim(),$push:{updateHistory:updateHistory}})
        return res.status(200).json({success:result!=null,result})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
})

router.patch("/emails",AuthenticationToken,StoreAuthorization,async(req,res)=>{
    const {emails,storeId} = req.body 
    const {userId,role} = req.user 
    let canAccess = true   
    try {
            if(canAccess){
                //insert the new store location 
                const updateHistory = {updated_by:userId,updated_date:Date.now(),remarks:"Email changed into "+emails}
                await StoreModel.updateOne({_id:storeId}, {  emails: emails,$push:{updateHistory:updateHistory}} )
                return res.status(200).json({success:true,message:"Updated"})
                
            }else{
                return res.status(422).json({success:false,message:"You aren't authorized to access this section"})
            }
    } catch (error) {
        return res.status(500).json({success:false,error})
    }

})


router.patch("/status",AuthenticationToken,StoreAuthorization,async(req,res)=>{
    const {userId,role} = req.user 
    const {status,storeId} = req.body  
    try {
        const updateHistory = {updated_by:userId,updated_date:Date.now(),remarks:"Status changed into "+status}
        const result = await StoreModel.updateOne({_id:storeId},{status:status,$push: { updateHistory: updateHistory}})
        return res.status(200).json({success:result!=null,result})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
})

router.get("/v2/storeId",Store.getStoreById)

module.exports = router
