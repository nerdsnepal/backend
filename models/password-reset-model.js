const { default: mongoose, Schema } = require("mongoose");


const PasswordRestSchema  = mongoose.Schema({
    userId:{type:Schema.Types.ObjectId,ref:"users"},
    resetThrough:{type:String,enum:["username","email"],require:true},
    resetCode:{type:String,require:true},
    isCodeUsed:{type:Boolean,require:true,default:false},
    passwordResetToken:{type:String,require:false,default:""},
    isPasswordReset:{type:Boolean,default:false},
    creation_date:{type:Date,default:Date.now()},
    expire_date: {type:Date,default:new Date().setMinutes(new Date().getMinutes()+5)}
})


module.exports = mongoose.model("password_reset",PasswordRestSchema)