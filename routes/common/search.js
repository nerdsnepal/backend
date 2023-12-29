
const {  VerifyTokenAndGetUser } = require("../../middleware/auth-token")
const userModel = require("../../models/user-model")
const { isEmpty } = require("../../common/utils")
const userSearchModel = require("../../models/user.search.model")
const { searchProducts } = require("../../controller/search")

const app = require("express").Router()

app.get("/users/:value",async(req,res)=>{
    const value = req.params.value
    let users = null
    try {
        if(value==="all"){
            users =await userModel.find({})
        }else{
            users =await userModel.find({$text:{$search:`${value}`}},{score:{$meta:"textScore"}})
            .sort( { score: { $meta: "textScore" } } ) 
        }
        
        res.json({
           success:true,
           users:users
        })
    } catch (error) {
        console.log(error);
        res.json({
            status:false,
            message:"Something went wrong"
        })
    }


})
app.get('/user',async(req,res)=>{
   try {
    let {userIds} = req.query
    userIds = userIds?.split(',')
    if(userIds && isEmpty(userIds[0])){
        throw new Error("Something went wrong")
    }
    let users = await userModel.find({_id:{$in:userIds}})
    users = users?.map((user)=>{
        user.password= undefined
        user.address = undefined
        user.metaData= undefined
        user.creation_date = undefined
        return user 
    })
    return res.json({success:true,users})
   } catch (error) {
    console.log(error);
        return res.status(500).json({success:false,error:"Something went wrong"})
   }
})

//search for products  
app.get("/products",VerifyTokenAndGetUser,async(req,res)=>{
    try {
     const {q} = req.query 
     const {userId} = req.user

     if(isEmpty(q)){
        throw new Error("Query can't be empty")
     }
     
     await userSearchModel({userId,query:q,metaData:req.meta}).save()
     const products = await searchProducts(q)
     return res.status(200).json({
        success:true,
        data:products
     })
     
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error:"Internal server error"})
    }

})



module.exports = app 