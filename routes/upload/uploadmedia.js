const { AuthenticationToken } = require("../../middleware/auth-token")
const { uploadProductMedia, compressAndReturnUrlMiddleware, uploadStoreLogo } = require("../../middleware/upload-middleware")
const MediaModel = require("../../models/media-model")
const fs = require("fs")
const { StoreAuthorization } = require("../admin/store/middleware/check-authorization")
const app = require("express").Router()
const SharedEventEmitter = require("../../common/shared-event-emitter")
const StoreModel = require("../admin/store/model/storemodel")
/*
    Only the authenticated user can upload the file 
    and the middleware compress the file and return the corresponding 
    URI 


*/

app.post("/",AuthenticationToken,uploadProductMedia,compressAndReturnUrlMiddleware,async(req,res)=>{
    try{
        const {storeId} = req.body
        const {userId} = req.user 
        const currentUrls = req.uploadedUrl
        let urls = []
        for(let url of currentUrls){
            urls.push({url,alt:""})
        }
        await MediaModel({storeId,userId,urls}).save()
        return res.status(200).json({success:true,urls:currentUrls})
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,error:"Something went wrong"})
    }
})
app.post('/logo',AuthenticationToken,uploadStoreLogo,StoreAuthorization,compressAndReturnUrlMiddleware,async(req,res)=>{
    try{
        const {storeId} = req.body
        const {userId} = req.user 
        const currentUrls = req.uploadedUrl
        let urls = []
        for(let url of currentUrls){
            urls.push({url,alt:""})
        }
        await MediaModel({storeId,userId,urls}).save()
        const updateHistory = {updated_by:userId,updated_date:Date.now(),remarks:`Logo changed ${urls}` }
        let result = await StoreModel.updateOne({_id:storeId},{
            logo:currentUrls[0],$push:{updateHistory}
        })
        SharedEventEmitter.emit('onlogoChanged',({storeId,userId,urls}))
        return res.status(200).json({success:result!==null,logoUrl:currentUrls[0]})
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,error:"Something went wrong"})
    }
})

app.delete('/',AuthenticationToken,async(req,res)=>{
    const {userId} = req.user 
    const {path,storeId} = req.body 
    try {
        const media = await MediaModel.findOne({userId,url:path,storeId})
        if(media){
            fs.unlinkSync(path)
            media.urls.pull({url:path})
            await media.save()
        }
        return res.json({success:true,message:"Deleted"})
    } catch (error) {
        return res.json({success:false,error:"Something went wrong"})
    }


})

module.exports = app 
