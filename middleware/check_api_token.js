const { isEmpty } = require("../common/utils")


const CheckAPIAcessToken = (req,res,next)=>{
    const token = req.headers['sichu-api-key']
    if(isEmpty(token)){
        return res.status(401).json({success:false,error:"Api key required"})
    }
    if(token===process.env.SICHU_API_TOKEN){
        return next()
    }
    return res.status(401).json({success:false,error:"Invalid api key"})

}

module.exports = {CheckAPIAcessToken}