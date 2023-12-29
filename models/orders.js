
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    storeId: {
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
      name: {
        type: String,
        required: true,
      },
      mediaUrls:{
        type:Array,
        default:[]
      },
      price:{
        type:Number,
        required:true
      },
      quantity: {
        type: Number,
        required: true,
      },
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
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  deliveryCharge: {
    type: Number,
    default: 0, 
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  billingAddress: {
    address1: {type:String,required:true},
    city:  {type:String,required:true},
    fullName: {type:String,required:true},
    phoneNumber: {type:String,required:true},
    state:  {type:String,required:true},
    landmark: String,
    country:  {type:String,required:true},
  },
  deliveryAddress: {
    address1:  {type:String,required:true},
    fullName: {type:String,required:true},
    city:  {type:String,required:true},
    phoneNumber: {type:String,required:true},
    state:  {type:String,required:true},
    landmark: String,
    country:  {type:String,required:true},
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Credit Card', 'Esewa', 'Cash on Delivery','None'],
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  signature:{
    type:String,
    required:true,
  }
});





const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
