const { VerifyTokenAndGetUser } = require("../../middleware/auth-token")
const { trendProductBasedOnViews } = require("../../controller/product.trend")

const app = require("express").Router()


app.get("/",VerifyTokenAndGetUser,async(req,res)=>{
   
    try {
        const {userId} = req.user 
        let products = await trendProductBasedOnViews()
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