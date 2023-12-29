const { default: mongoose } = require("mongoose");
const SubscribeSchema = new mongoose.Schema(
    {
        email:{type:String,require:true,unique:true},
        metaData:{type:Object,require:false},
        isSubscribe:{type:Boolean,require:true,default:true},
        subscribe_at:{type:Date,default:Date.now()}
    }
)

module.exports = mongoose.model("subscribe",SubscribeSchema)