const { default: mongoose, Schema } = require("mongoose");

const MediaSchema = mongoose.Schema({
    created_date:{type:Date,default:Date.now()},
    urls:[
        {
            type:Object,
            properties:{
                url:{type:String,require:true},
                alt:{type:String,require:true,default:""},
                description:{type:String,require:true,default:""}
            }
        }
        
    ],
    storeId:{type:String,require:false},
    userId:{type:Schema.Types.ObjectId,ref:"users",require:true},

})
module.exports = mongoose.model("media",MediaSchema)