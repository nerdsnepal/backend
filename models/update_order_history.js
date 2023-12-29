const mongoose = require('mongoose');

const updateOrderHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  message:{
    type:String,
    required:true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
 
});
const UpdateOrderHistory = mongoose.model('updateOrderHistory', updateOrderHistorySchema);

module.exports = UpdateOrderHistory;
