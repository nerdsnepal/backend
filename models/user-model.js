const { default: mongoose } = require("mongoose");
const { USERTYPE } = require("../common/utils");

const UserSchema = new mongoose.Schema(
    {
        name:{type:String,require:true},
        username:{type:String,require:true,unique:true},
        email:{type:String,require:true,unique:true},
        isVerified:{type:Boolean,default:false},
        profile:{type:String,require:false, default:"assets/profile/profile.jpg"},
        password:{type:String,require:true},
        role:{type:String,require:false,default:USERTYPE.DEFAULT},
        dob:{type:Date,default:null},
        phone:{
            type:Object,
            properties:{
                code:{type:String,required:true,default:"977"},
                number:{type:String,required:true}
            },
            default:null
        },
        creation_date:{type:Date,require:true,default:Date.now()},
        gender: {type:String,enum:["Male","Female","Other","Prefer not to say"],default:"Prefer not to say"},
        metaData:{type:Object,require:false}
    }
)

UserSchema.index({
   name:'text'
})

module.exports = mongoose.model("user",UserSchema)