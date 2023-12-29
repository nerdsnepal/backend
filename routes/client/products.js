
const { default: mongoose } = require("mongoose")
const { addTotalQuantityForProduct } = require("../../common/products")
const { removeAttribute } = require("../../common/user.hide.secrete")
const { VerifyTokenAndGetUser } = require("../../middleware/auth-token")
const { getAllProductByStoreId, findProductsByCategory } = require("../../controller/product")
const { storeById } = require("../../controller/store")
const Store = require("../../controller/store")
const ProductS = require("../../services/product/product")

const app = require("express").Router()

/* GET The product information according to the store */
app.get("/",VerifyTokenAndGetUser,async(req,res)=>{
    try {
        const {userId} = req.user 
        const {storeId} = req.query
        if(storeId===undefined || !mongoose.isValidObjectId(storeId)){
            return res.status(500).json({success:false,error:"Invalid store id"})
        }
        let store =await Store.storeById({storeId})
        let products =await getAllProductByStoreId({userId,storeId})
        products = removeAttribute(products,['created_by','returns_count','sales_count','created_at','updated','costPrice','__v','views_count'])
        products = addTotalQuantityForProduct(products)
        return res.status(200).json({
            success:true,
            data:{
                store,
                products
            }
        })

    } catch (error) {
        console.log(error);
         return res.status(500).json({success:false,error:"Internal server error"})
    }


})
/* Get the product according to the category */
app.get("/category",VerifyTokenAndGetUser,async(req,res)=>{
    try {
        const {userId} = req.user 
        const {name,subcategory} = req.query
        let products =await findProductsByCategory(name,subcategory,userId)
        products = removeAttribute(products,['created_by','returns_count','sales_count','created_at','updated','costPrice','__v','views_count'])
        products = addTotalQuantityForProduct(products)
        return res.status(200).json({
            success:true,
            data:products
        })

    } catch (error) {
        console.log(error);
         return res.status(500).json({success:false,error:"Internal server error"})
    }
})


app.get("/series",VerifyTokenAndGetUser,async(req,res)=>{
    try {
        const {userId} = req.user 
        const {_id} = req.query
        let products =await ProductS.getAllProductsBySeriesId({seriesId:_id})
        console.log(products);
        products = removeAttribute(products,['created_by','returns_count','sales_count','created_at','updated','costPrice','__v','views_count'])
        products = addTotalQuantityForProduct(products)
        return res.status(200).json({
            success:true,
            data:products
        })

    } catch (error) {
        console.log(error);
         return res.status(500).json({success:false,error:"Internal server error"})
    }
})


module.exports = app 