const { default: mongoose } = require("mongoose")
const productModel = require("../../models/product-model")
const Rating = require("../../models/rating")

class RatingService {

    async rate({data,userId}){
        if(await await Rating.findOne({userId,orderId:data.orderId,productId:data.productId})){
            throw new Error("Already rated")
        }
        const result = await Rating({...data,userId}).save()
        if(result){
            const _data = await productModel.findOne({storeId:data.storeId,_id:data.productId})
            if(_data){
                _data.rating = await this._getAverageRatingForProduct({productId:data.productId})
                return await _data.save()
            }
        }
        return null
    }
     _getAverageRatingForProduct = async function({productId}) {
        try {
          const result = await this.aggregate([
            {
              $match: { productId: new mongoose.Types.ObjectId(productId) }
            },
            {
              $group: {
                _id: null,
                averageRating: { $avg: '$value' }
              }
            }
          ]);
      
          if (result.length > 0) {
            return result[0].averageRating;
          } else {
            return 0; 
          }
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
    };
    async getRateByuserId({userId,orderId}){
        return await Rating.find({userId,orderId})
    }
   async getReviews({productId}){
    return await Rating.find({productId:productId})
    .populate("userId","_id name profile")
   }
   async  getAverageRatingByProductId(productId) {
    try {
      const pipeline = [
        {
          $match: {
            productId: new mongoose.Types.ObjectId(productId)
          }
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$value' }
          }
        }
      ];
  
      const result = await Rating.aggregate(pipeline);
  
      if (result.length > 0) {
        return result[0].averageRating;
      } else {
        return 0; // Or any default value when no ratings are found for the product
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

}
const RatingS = new RatingService()

module.exports = RatingS