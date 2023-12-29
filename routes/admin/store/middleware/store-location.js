const { isEmpty } = require("../../../../common/utils")

const StockLocationRequiredFieldChecker = (req,res,next)=>{
    let error = []
    try {
        const {country,state,city} = req.body 
        if(isEmpty(country))error.push("Country field can't be empty")
        if(isEmpty(state))error.push("State field can't be empty")
        if(isEmpty(city))error.push("City field can't be empty")
        if(error.length>0){
            return res.status(401).json({success:false,error})
        }
       next()
    } catch (error) {
        
        return res.status(500).json({success:false,error})
    }
}


module.exports = {
    StockLocationRequiredFieldChecker
}