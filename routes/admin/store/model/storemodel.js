const { default: mongoose, Schema } = require("mongoose");
const { SUBSCRIPTIONLEVEL, SUBSCRIPTIONMODEL } = require("../../../../common/utils");


const StoreModelSchema = mongoose.Schema({
    created_by:{type:Schema.Types.ObjectId,require:true,ref:"users"},
    creation_date:{type:Date,require:true,default:Date.now()},
    name:{type:String,require:true,unique:true},
    displayName:{type:String},
    isSubdomain:{type:Boolean,require:true,default:false},
    domainName:{type:String,require:false,unique:false},
    emails:{type:Array},
    merchantId:{type:Schema.Types.ObjectId,require:true,unique:false,ref:"users"},
    logo:{type:String,default:null},
    status:{type:Boolean,require:true,default:false},
    websiteLayout:[],
    about:{type:String,default:""},
    description:{type:String,default:""},
    address:{type:Object,properties:{
        country:{type:String},
        postalCode:{type:Number},
        addressLine1: { type: String },
        addressLine2: { type: String },
        state:{type:String},
        district:{type:String},
        city:{type:String},
        geocoordinate:{type:Object,properties:{
            latitude:{type:String},
            longitude :{type:String}
        }}
    }},
    paymentMethod:[
        {
            type:Object,
            properties:{
                type:{type:String,require:true},
                paymentMerchantId:{type:String,require:true}
            }
        }
    ],
    subscriptionDetails:[{
        type:Object,
        properties:{
            paymentMethod:{type:String,default:"None"},
            subscribed_date:{type:Date,default:Date.now(),require:true},
            expire_on:{type:Date,default:null},
            isExpire:{type:Boolean,default:false},
            subscriptionLevel:{type:String,enum:[SUBSCRIPTIONLEVEL.Basic,SUBSCRIPTIONLEVEL.Medium,SUBSCRIPTIONLEVEL.Premium],default:SUBSCRIPTIONLEVEL.Basic},
            subscriptionModel:{type:String,enum:[SUBSCRIPTIONMODEL.Annual,SUBSCRIPTIONMODEL.Monthly,SUBSCRIPTIONMODEL.Freemium],default:SUBSCRIPTIONMODEL.Freemium}
        }

    }],
    stockLocation:[
        {
            type: Object,
            properties: {
                _id:{type:String,default:new Date().getMilliseconds(),require:true},
                created_by:{type:Schema.Types.ObjectId,ref:"users"},
                updated_by:{type:Schema.Types.ObjectId,ref:"users"},
                creation_date:{type:Date,require:true,default:Date.now()},
                updated_date:{type:Date,},
                country: { type: String,default:"" },
                state: { type: String,default:"" }, 
                city: { type: String,default:"" },
                postalCode: { type: String,default:"" },
                addressLine1: { type: String ,default:"" },
                addressLine2: { type: String ,default:""},
                geocoordinate: {
                    type: Object,
                    properties: {
                        latitude: { type: String ,default:"" },
                        longitude: { type: String,default:'' }
                    }
                }
            }
        }
    ],
    updateHistory:[
        {
            type:Object,
            properties:{
                updated_by:{type:Schema.Types.ObjectId,require:true,unique:false,ref:"users"},
                updated_date:{type:Date.now(),require:true},
                remarks:{type:String}
            }
        }
    ]
})

module.exports = mongoose.model("store",StoreModelSchema)