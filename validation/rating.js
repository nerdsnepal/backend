const Joi = require('joi');

// Define a Joi schema for Ratings validation
const ratingValidationSchema = Joi.object({
  storeId: Joi.string().required(),
  orderId:Joi.string().required(),
  productId: Joi.string().required(),
  value: Joi.number().min(1).max(5).required(),
  timestamp: Joi.date().timestamp().default(Date.now),
  comment: Joi.string().allow('').optional().max(500) // Allow empty string as comment, up to 500 characters
});

module.exports = {
    validate:(data)=>{
        const { error, value } = ratingValidationSchema.validate(data);
        if (error) {
          throw new Error(error.details[0].message);
        }
        return value;
    }
};
