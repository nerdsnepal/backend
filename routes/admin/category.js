const { isEmpty, USERTYPE } = require("../../common/utils");
const { AuthenticationToken } = require("../../middleware/auth-token");
const { uploadProductMedia, compressAndReturnUrlMiddleware } = require("../../middleware/upload-middleware");
const CategoryModel = require("../../models/categorymodel");
const Category = require("../../models/categorymodel");
const { StoreAuthorization } = require("./store/middleware/check-authorization");
const app = require("express").Router()



app.post("/",AuthenticationToken,async(req,res)=>{
    try {
        const {name,status,urls,subCategory,storeId} =req.body
        const date = Date.now()
        const {userId} =req.user 
        let images = []
        for(const url of urls){
            images.push({url,uploaded_by:userId,uploaded_at:date})
        }
       await Category({name,images,status,subCategory,created_by:userId,updated_by:userId,storeId}).save()
        return res.status(200).json({success:true,message:"Category added"})
    } catch (error) {
        console.log(error);
       return res.status(500).json({success:false,message:"Something went wrong"})
    }
});

app.put("/",AuthenticationToken,uploadProductMedia,compressAndReturnUrlMiddleware,async(req,res)=>{
    try {
        const {name,_id} =req.body
        const {userId} =req.user 
        let images = []
        for(const url of req.uploadedUrl){
            images.push({url,uploaded_by:userId})
        }
        let update = null 
        if(isEmpty(name) && images.length===0)update={}
        if(!isEmpty){
            if(images.length>0) update={images}
        }else update={name}
        if(!isEmpty(name) && images.length>0) update={images,name}
        
        console.log(update);
       await Category.updateOne({_id},update)
        return res.status(200).json({status:true,message:"Category updated"})
    } catch (error) {

        console.log(error);
       return res.status(500).json({status:false,message:"Internal server error"})
    }
});


app.get("/",async(req,res)=>{
    try {
        let {status,storeId} = req.query
        let categories = null 
        
        if(isEmpty(status) && isEmpty(storeId) ){
            categories = await Category.find({})
        }else if(status==='true'){
            categories = await Category.find({status:true,storeId:{$in:[null,storeId]}})
        }else if(status==='false'){
            categories = await Category.find({status:false})
        }else{
            if(!isEmpty(storeId)){
                categories = await Category.find({storeId:{$in:[null,storeId]}})
            }
        }
         
        return res.status(200).json({success:true,categories})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
})
app.delete("/",AuthenticationToken,StoreAuthorization,async(req,res)=>{
    const {storeId,_id}= req.body
    const {role} = req.user 
    if(isEmpty(_id)){
        return res.status(422).json({success:false,message:"CategoryId is required"})
    }
    try{
        let result = null
        console.log(role);
        if(role===USERTYPE.MERCHANT){
            result = await CategoryModel.deleteOne({storeId,_id})
          }else if(role===USERTYPE.EMPLOYEE){
           //check for permission
           result = await CategoryModel.deleteOne({storeId,_id})
          }else if(role===USERTYPE.SUPERUSER){
            result = await CategoryModel.deleteOne({_id})
          }
          if(!result){
            return res.status(200).json({success:false,message:"Failed to delete"})
          }
          const {acknowledged} = result
          
        return res.status(200).json({success:acknowledged,message:acknowledged?"Deleted":"Failed to delete"})
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,error})
    } 
})

module.exports = app 
