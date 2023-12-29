const userVisitsModel = require("../models/user.visits.model")


exports.addUserVisit = ({userId,productId,meta})=>{
    console.log(meta);
    userVisitsModel({userId,productId,metaData:meta}).save();
}

