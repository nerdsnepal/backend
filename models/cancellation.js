
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        required: true,
    },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  products: [
    {
      storeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store',
        required: true,
      },
      productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,
      },
      reason: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});





const Cancellation = mongoose.model('cancellation', orderSchema);

module.exports = Cancellation;
