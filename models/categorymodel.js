const { default: mongoose, Schema } = require("mongoose");

const CategorySchema = mongoose.Schema({
    name:{type:String,require:true},
    subCategory:{type:Array,require:false},
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
    updated_by:{type:Schema.Types.ObjectId,ref:"users",required:true},
    updated_date:{type:Date,default:Date.now()},
    creation_date:{type:Date,default:Date.now()}   
})

CategorySchema.index({
    storeId:String
})

module.exports = mongoose.model("category",CategorySchema)