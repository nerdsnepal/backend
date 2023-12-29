const { checkExistsAndDelete } = require("../../common/compress")
const { addTotalQuantityForProduct, removeSensativeContent } = require("../../common/products")
const { USERTYPE, isEmpty } = require("../../common/utils")
const { AuthenticationToken } = require("../../middleware/auth-token")
const productModel = require("../../models/product-model")
const { AddProductMiddleware } = require("./middleware/product-add-middleware")
const { StoreAuthorization } = require("./store/middleware/check-authorization")

const app = require("express").Router()


app.post('/',AuthenticationToken,StoreAuthorization,AddProductMiddleware,async(req,res)=>{
  
    try {
        let result = null 
        const {role} = req.user 
       const {product} =req
    //   console.log(req);
       if(role===USERTYPE.MERCHANT){
         result = await productModel({...product}).save()
        
       }else if(role===USERTYPE.EMPLOYEE){
        //check for permission
         result= await productModel({...product}).save()
       }
      if(result){
        return res.status(200).json({success:true,message:"Product Added"})
      }else{
        return res.status(200).json({success:true,message:"Fail to add a product"})
      }
     
    } catch (error) {
       
       return res.status(501).json({success:false,error})
    }
})

app.get('/',AuthenticationToken,StoreAuthorization,async(req,res)=>{
    const {selected} = req.query||'all' 
    const {storeId} = req.query
    try {
        let products = []
        if(selected.toLowerCase()==='all')products =await productModel.find({storeId:storeId})
        else if(selected.toLocaleLowerCase()==='true')
        products =await productModel.find({storeId:storeId,status:true})
        else products =await productModel.find({storeId:storeId,status:false})
        products = addTotalQuantityForProduct(products)
        return res.status(200).json({success:true,products})
    } catch (error) {
        //console.log(error);
        return res.status(500).json({success:false,error})
    }
  
})
//get the product information by id
// this well give all the informations 
app.get('/id',AuthenticationToken,StoreAuthorization,async(req,res)=>{
    const {storeId,_id}= req.query
    const {role} = req.user 
    if(isEmpty(_id)){
        return res.status(422).json({success:false,message:"ProductId is required"})
    }
    try{
        let product = null
        if(role===USERTYPE.MERCHANT){
            product = await productModel.findOne({storeId,_id})
           
          }else if(role===USERTYPE.EMPLOYEE){
           //check for permission
           product = await productModel.findOne({storeId,_id})
          }
          product = addTotalQuantityForProduct([product])

        return res.status(200).json({success:true,product:product[0]})
    }catch(error){
        return res.status(500).json({success:false,error})
    }
})

//delete product by id 
app.delete('/',AuthenticationToken,StoreAuthorization,async(req,res)=>{
    const {storeId,_id}= req.body
    const {role} = req.user 
    if(isEmpty(_id)){
        return res.status(422).json({success:false,message:"ProductId is required"})
    }
    try{
        let result = null
        if(role===USERTYPE.MERCHANT){
            result = await productModel.deleteOne({storeId,_id})
           
          }else if(role===USERTYPE.EMPLOYEE){
           //check for permission
           result = await productModel.deleteOne({storeId,_id})
          }
          const {acknowledged} = result
        return res.status(200).json({success:acknowledged,message:acknowledged?"Deleted":"Failed to delete"})
    }catch(error){
        return res.status(500).json({success:false,error})
    }
})

// get the products for the end-users 
// here we are fetching the products on the basis of the user 
app.get('/all',async(req,res)=>{
    try {
        let products = await productModel.find({})
        products = addTotalQuantityForProduct(products)
        products = removeSensativeContent(products) 
        return res.status(200).json({success:true,products:products})
    } catch (error) {
   
        return res.status(500).json({success:false,error})
    }
})
app.get('/store',async(req,res)=>{
    const {storeId} = req.query 
    if(isEmpty(storeId))return res.status(422).json({success:false,error:"Store id required"})
    try {
        let products = await productModel.find({storeId})
        products = addTotalQuantityForProduct(products)
        products = removeSensativeContent(products) 
        return res.status(200).json({success:true,products:products})
    } catch (error) {
        return res.status(500).json({success:false,error})
    }
})
//update product name 
app.patch('/name',AuthenticationToken,StoreAuthorization,async(req,res)=>{
    const {name,storeId,productId} = req.body 
    const {userId} = req.user 
    const canAccess = true 
    try {
        if(isEmpty(name)){
            return res.status(422).json({success:false,message:"Product name is required"})
        }
        if(!canAccess){
            return res.status(401).json({success:false,message:"Unauthozied"})
        }
        const updateHistory = {updated_by:userId,updated_at:Date.now(),remarks:"Updated name into "+name}
        const {acknowledged} =await  productModel.updateOne({_id:productId,storeId:storeId},{
            name:name,$push:{updated:updateHistory}
        })
        return res.status(200).json({success:acknowledged,message:acknowledged?"Updated name":"Failed to update"})
    } catch (error) {
        return res.status(500).json({success:false,error})
    }
})
//update description 
app.patch('/description',AuthenticationToken,StoreAuthorization,async(req,res)=>{
    const {description,storeId,productId} = req.body 
    const {userId} = req.user 
    const canAccess = true 
    try {
        if(isEmpty(description)){
            return res.status(422).json({success:false,message:"Description  is required"})
        }
        if(!canAccess){
            return res.status(401).json({success:false,message:"Unauthozied"})
        }
        const updateHistory = {updated_by:userId,updated_at:Date.now(),remarks:"Updated description into "+description}
        const {acknowledged} =await  productModel.updateOne({_id:productId,storeId:storeId},{
            description,$push:{updated:updateHistory}
        })
        return res.status(200).json({success:acknowledged,message:acknowledged?"Updated":"Failed to update"})
    } catch (error) {
        return res.status(500).json({success:false,error})
    }
})
//update description
app.patch('/quantities',AuthenticationToken,StoreAuthorization,async(req,res)=>{
    const {quantities,storeId,productId} = req.body 
    const {userId} = req.user 
    const canAccess = true 
    try {
        if(isEmpty(quantities)){
            return res.status(422).json({success:false,message:"Description  is required"})
        }
        if(!canAccess){
            return res.status(401).json({success:false,message:"Unauthozied"})
        }
        const {acknowledged} =await  productModel.updateOne({_id:productId,storeId:storeId},{
            $set:{'inventory.quantities':quantities}
        })
        console.log(acknowledged);
        return res.status(200).json({success:acknowledged,message:acknowledged?"Updated":"Failed to update"})
    } catch (error) {
        return res.status(500).json({success:false,error})
    }
})
//update seo 
app.patch('/seo',AuthenticationToken,StoreAuthorization,async(req,res)=>{
    const {description,title,storeId,productId} = req.body 
    
    const seo ={description,title}
    console.log(seo);
    const {userId} = req.user 
    const canAccess = true 
    try {
        if(!canAccess){
            return res.status(401).json({success:false,message:"Unauthozied"})
        }
        const updateHistory = {updated_by:userId,updated_at:Date.now(),remarks:"Updated seo into "+JSON.stringify(seo)}
        const {acknowledged} =await  productModel.updateOne({_id:productId,storeId:storeId},{
            seo,$push:{updated:updateHistory}
        })
        return res.status(200).json({success:acknowledged,message:acknowledged?"Updated":"Failed to update"})
    } catch (error) {
        return res.status(500).json({success:false,error})
    }
})



app.patch('/status',AuthenticationToken,StoreAuthorization,async(req,res)=>{
    const {status,storeId,productId} = req.body 
    const {userId} = req.user 
    const canAccess = true 
    try {
        if(!canAccess){
            return res.status(401).json({success:false,message:"Unauthozied"})
        }
        const updateHistory = {updated_by:userId,updated_at:Date.now(),remarks:"Updated status into "+status}
        const {acknowledged} =await  productModel.updateOne({_id:productId,storeId:storeId},{
            status:status,$push:{updated:updateHistory}
        })
        return res.status(200).json({success:acknowledged,message:acknowledged?"Updated status":"Failed to update"})
    } catch (error) {
        return res.status(500).json({success:false,error})
    }
})

//update price 
app.patch('/price',AuthenticationToken,StoreAuthorization,async(req,res)=>{
    let {price,storeId,productId} = req.body 
    const {userId} = req.user 
    const canAccess = true 
    try {
        price.mrp = Number(price.mrp) 
        if(!isEmpty(price.compare_at)){
            price.compare_at = Number(price.compare_at)
            if(price.mrp>price.compare_at){
                return res.status(422).json({success:false,message:"Price can't be greater than compare at price"})
            }
        }
        if(!canAccess){
            return res.status(401).json({success:false,message:"Unauthozied"})
        }
        const updateHistory = {updated_by:userId,updated_at:Date.now(),remarks:"Updated price into "+JSON.stringify(price)}
        const {acknowledged} =await  productModel.updateOne({_id:productId,storeId:storeId},{
            price:price,$push:{updated:updateHistory}
        })
        return res.status(200).json({success:acknowledged,message:acknowledged?"Updated price":"Failed to update"})
    } catch (error) {
        return res.status(500).json({success:false,error})
    }
})

app.patch('/media',AuthenticationToken,StoreAuthorization,async(req,res)=>{
    let {mediaUrls,deletePath,storeId,productId} = req.body 
    const {userId} = req.user 
    const canAccess = true 
    try {
        if(mediaUrls.length===0){
            throw new Error("MediaUrls can't be empty")
        }
        if(!canAccess){
            return res.status(401).json({success:false,message:"Unauthozied"})
        }
        const updateHistory = {updated_by:userId,updated_at:Date.now(),remarks:"Updated mediaUrls into "+mediaUrls.toString()}
        const {acknowledged} =await  productModel.updateOne({_id:productId,storeId:storeId},{
            mediaUrls:mediaUrls,$push:{updated:updateHistory}
        })
        if(acknowledged){
            for(const path of deletePath){
                checkExistsAndDelete(path)
            }
        }
        return res.status(200).json({success:acknowledged,message:acknowledged?"Updated media":"Failed to update"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
})








module.exports = app 