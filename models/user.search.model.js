const { default: mongoose, Schema } = require("mongoose");
//User Visit Details for the analytics
const UserSearchSchema = new mongoose.Schema(
    {
        userId:{type:String,require:true,default:null},
        query:{type:String,require:true},
        metaData:{type:Object,require:false},
        timestamp:{type:Date,require:true,default:Date.now},
    }
)
UserSearchSchema.index({ userId: String, productId: String });
UserSearchSchema.index({ timestamp: Date });
module.exports = mongoose.model("user_search",UserSearchSchema)