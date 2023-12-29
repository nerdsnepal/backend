const { default: mongoose, Schema } = require("mongoose");

const EmailVerifierSchema = mongoose.Schema({
    userId:{type:Schema.Types.ObjectId,ref:"users"},
    code: {type:String,length:6,require:true},
    creation_date:{type:Date,default:Date.now()},
    expire_date: {type:Date,default: function() {
        return new Date(Date.now() + 5 * 60 * 1000); 
      },}
})

module.exports = mongoose.model("email_verifier",EmailVerifierSchema)