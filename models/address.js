const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    default:{type:Boolean,default:false},
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', 
      required: true,
    },
    billing: {
      fullName: { type: String, required: true },
      address1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      landmark:{type:String,required:false,default:""}
    },
    delivery: {
      fullName: { type: String, required: true },
      address1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      landmark:{type:String,required:false,default:""},
      label:{type:String,enum:["Home","Office"],default:"Home",required:true},
    },
  },
 
);

const Address = mongoose.model('address', addressSchema);

module.exports = Address;
