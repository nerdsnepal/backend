const { default: mongoose, Schema } = require("mongoose");
//User Visit Details for the analytics
const UserVisitSchema = new mongoose.Schema(
    {
        userId:{type:String,require:true,default:null},
        productId:{type:Schema.Types.ObjectId,ref:"products"},
        metaData:{type:Object,require:false},
        timestamp:{type:Date,require:true,default:Date.now},
    }
)
UserVisitSchema.index({ userId: String, productId: String });
UserVisitSchema.index({ timestamp: Date });
module.exports = mongoose.model("user_visits",UserVisitSchema)