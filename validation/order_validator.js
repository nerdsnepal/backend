const Joi = require('joi');


const orderSchema = Joi.object({
  storeId: Joi.string().required(),
  products: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      mediaUrls: Joi.array().items(Joi.string()).default([]),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
      storeId: Joi.string().required(),
      productId: Joi.string().required(),
    })
  ).required(),

  totalAmount: Joi.number().required(),
  deliveryCharge: Joi.number().default(0),
  status: Joi.string().valid('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled').default('Pending'),
  billingAddress: Joi.object({
    address1: Joi.string(),
    city: Joi.string(),
    fullName: Joi.string(),
    phoneNumber: Joi.string(),
    state: Joi.string(),
    landmark: Joi.string().allow(''),
    country: Joi.string(),
  }),

  deliveryAddress: Joi.object({
    address1: Joi.string(),
    fullName: Joi.string(),
    city: Joi.string(),
    phoneNumber: Joi.string(),
    state: Joi.string(),
    landmark: Joi.string().allow(''),
    country: Joi.string(),
    label:Joi.string(),
  }),
  paymentMethod: Joi.string().valid('Credit Card', 'Esewa', 'Cash on Delivery','None').default('None'),
  paymentStatus: Joi.string().valid('Pending', 'Completed', 'Failed').default('Pending'),
  createdAt: Joi.date().default(Date.now),
});


module.exports = {
    validate:(data)=>{
        const { error, value } = orderSchema.validate(data);
        if (error) {
          throw new Error(error.details[0].message);
        }
        return value;
    }
};


