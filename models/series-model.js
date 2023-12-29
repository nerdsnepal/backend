const { default: mongoose, Schema } = require("mongoose");

const SeriesSchema = mongoose.Schema({
    name:{type:String,require:true},
    images:[
            {
                type:Object,
                properties:{
                    uploaded_by:{type:Schema.Types.ObjectId,ref:"users"},
                    uploaded_at:{type:Date,default:Date.now(),require:true},
                    url:{type:String,required:true}
                }
            }
    ],
    status:{type:Boolean,default:false,require:true},
    storeId:{type:String,required:false,default:""},    
    created_by:{type:Schema.Types.ObjectId,ref:"users",required:true},
    updated_by:{type:Schema.Types.ObjectId,ref:"users",default:null},
    updated_date:{type:Date,default:Date.now()},
    creation_date:{type:Date,default:Date.now()}   
})

const SeriesModel = mongoose.model("series",SeriesSchema);

module.exports = SeriesModel;