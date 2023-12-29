const RatingS = require("../services/product/rating")
const rating = require("../validation/rating")

class RatingController{

    async rate(req,res){
     try {
        const {userId} = req.user 
        const validateData = rating.validate(req.body)
        const result = await RatingS.rate({data:validateData,userId})
        return res.status(200).json({success:true,data:result})
     } catch (error) {
        console.log(error);
        res.status(500).json({success:false,error:error.message})
     }
    }
    async getReview(req,res){
      try {
         const {productId} = req.query; 
         const result = await RatingS.getReviews({productId})
         console.log(result);
         return res.status(200).json({success:true,data:result})
      } catch (error) {
         console.log(error);
         res.status(500).json({success:false,error:error.message})
      }
    }
    

}
const RatingC = new RatingController()
module.exports = RatingC