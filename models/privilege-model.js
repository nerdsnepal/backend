const { default: mongoose, Schema } = require("mongoose");

const UserPrivilegeSchema = mongoose.Schema({
    created_by:{type:Schema.Types.ObjectId,require:true,ref:"users"},
    privilege_to:{type:Schema.Types.ObjectId,require:true,ref:"users"},
    privileges:[
        {
            type:Object,
            properties:{
                name:String,
                collection:String,
                actions:Array
            }
        }
    ],
    dates:{
        type:Object,
        properties:{
            expire_date:{type:Date, default:null},
            created_date:{type:Date, default:Date.now()},
            updated_date:{type:Date,default:null},
        }
    },
    isExpired:{type:Boolean,require:true,default:false},
    updated_by:{type:Schema.Types.ObjectId,default:null}
})
module.exports = mongoose.model("userPrivilege",UserPrivilegeSchema)