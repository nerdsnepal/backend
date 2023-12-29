const mongoose = require('mongoose');

// Define a schema for Ratings
const RatingSchema =  mongoose.Schema({
 storeId:{type: mongoose.Schema.Types.ObjectId, ref: 'store', required: true},
 orderId:{type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, 
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
  value: { type: Number, required: true,min:1,max:5 }, 
  timestamp: { type: Date, default: Date.now }, 
  comment: { type: String } 
});

// Create a model based on the Rating schema
const Rating = mongoose.model('Rating', RatingSchema);

module.exports = Rating;
