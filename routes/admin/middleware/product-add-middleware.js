const { compare } = require("bcrypt")
const { isEmpty } = require("../../../common/utils")

const AddProductMiddleware = (req,res,next)=>{
    let errors =[]
    try {
        const {userId} = req.user 
        const {storeId,name,description,price,mediaUrls,
            status,inventory,tax,costPrice,variants,
            seo,category,seriesId
        }= req.body 
        let product = {}
        if(isEmpty(name)){
           errors.push({key:"name",value:"Product name is requried"})    
        }
        if(isEmpty(description)){
            errors.push({key:"description",value:"Product description is requried"})    
         }
         if(price){
            if(isEmpty(price.mrp)){
                errors.push({key:"mrp",value:"Product selling price is requried"})    
            }
         }else{
            errors.push({key:"mrp",value:"Product selling price is requried"})    
         }
         if(mediaUrls){
            if(mediaUrls?.length===0){
                errors.push({key:"mrp",value:"Product image is requried"})    
            }
         }else{
            errors.push({key:"mrp",value:"Product image is requried"})    
         }
         if(inventory){
            if(inventory?.quantities.length===0){
            errors.push({key:"quantities",value:"Product quantity is requried"})    
            }
         }else{
            errors.push({key:"inventory",value:"Inventory details is requried"})    
         }
         if(errors.length>0){
            return res.status(401).json({success:false,errors})
         }
         product.created_by = userId
         product.name = name 
         product.description= description 
         product.storeId = storeId 
         product.mediaUrls = mediaUrls 
         product.price = price 
         product.inventory = inventory
         product.seriesId= seriesId
         if(costPrice)product.costPrice = costPrice 
         
         if(seo){
            if(seo?.title)product.seo = {...product.seo,title:seo?.title} 
            if(seo?.description) product.seo = {...product.seo,description:seo?.description} 
         }
         if(tax) product.tax = tax 
         if(status) product.status = status 
         if(category) product.category = category
         if(variants) product.variants = variants
         req.product = product
         return next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }







}


module.exports = {

AddProductMiddleware

}

