
const { SchemaType, Schema, default: mongoose } = require("mongoose")
const { addTotalQuantityForProduct, minMax } = require("../../common/products")
const { removeAttribute } = require("../../common/user.hide.secrete")
const { isEmpty } = require("../../common/utils")
const { VerifyTokenAndGetUser } = require("../../middleware/auth-token")
const {  getAllCategoryByStatus } = require("../../controller/category")
const { getAllProductsyStatus, getProductById } = require("../../controller/product")
const { addUserVisit } = require("../../controller/user.visits")
const ProductS = require("../../services/product/product")
const SeriesS = require("../../services/series/series")
const RatingS = require("../../services/product/rating")



const app = require("express").Router()


app.get("/",VerifyTokenAndGetUser,async(req,res)=>{
    try {
        const {userId} = req.user 
        let categories =await getAllCategoryByStatus({userId})
        categories = removeAttribute( categories,['created_by','updated_by','updated_date','creation_date','__v','status'])
        let products =await getAllProductsyStatus({userId})
        products = removeAttribute(products,['created_by','created_at','updated','costPrice','__v'])
        products = addTotalQuantityForProduct(products)
        const series = await SeriesS.fetchAllSeries();
        const price = minMax(products)
        return res.status(200).json({
            success:true,
            data:{
                price,
                categories,
                products,
                series
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error:"Internal server error"})
    }


})
// get product according to the id
app.get("/v2/product",VerifyTokenAndGetUser,async(req,res)=>{
    try {
        const {userId} = req.user 
        const {_id} = req.query
        const {meta} = req 
        if(isEmpty(_id) || !mongoose.isValidObjectId(_id)){
            return res.status(200).json({
                success:false,
                error:"Invalid product id"
            })
        }
        let product =await getProductById({userId,status:true,_id})
        const rating = await RatingS.getAverageRatingByProductId(product._id)
        const reviews = await RatingS.getReviews({productId:product._id})
        product.rating=rating;
        if(product){
            product = removeAttribute([product],['created_by','returns_count','sales_count','created_at','updated','costPrice','__v','views_count'])
            product = addTotalQuantityForProduct(product)[0]
        }
       
      await addUserVisit({userId,productId:_id,meta:meta})
        return res.status(200).json({
            success:true,
            data:{...product._doc,reviews}
        })

    } catch (error) {
        console.log(error);
         return res.status(500).json({success:false,error:"Internal server error"})
    }
})
//get all the category 
app.get("/v2/category",VerifyTokenAndGetUser,async(req,res)=>{
    try {
        const {userId} = req.user 
        let categories =await getAllCategoryByStatus({userId})
        categories = removeAttribute( categories,['created_by','updated_by','updated_date','creation_date','__v','status'])
        return res.status(200).json({
            success:true,
            data:categories
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error:"Internal server error"})
    }

})






module.exports = app 