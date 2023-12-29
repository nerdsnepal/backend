const UserS = require("../services/user/user_service");
const address_validator = require("../validation/address_validator");

class UserController {

    async  getUser(req,res) {
        const {userId} = req.user;
       try {
            let user = await UserS.getUserById(userId);
            const address = await UserS.getUserAddressByUserId(userId);
            user = {...user._doc,address};
            return res.status(200).json({status:true,user})
           
       } catch (error) {
      
            return res.status(500).json({status:false,error:error.message})
       }
    }
    async addAddress(req,res){
        try {
            const {userId} = req.user;
            const validatedAddress = address_validator.validate(req.body)
            const result = await UserS.addAddress({userId,address:validatedAddress});
            return res.status(200).json({status:true,address:result})
       } catch (error) {
        console.log(error);
        return res.status(500).json({status:false,error:error.message})
       }
    }
    async updateAddress(req,res){
        try {
            const {userId} = req.user;
            const {delivery,billing,_id } = req.body;
            const def = req.body.default;
            const validateDelivery = address_validator.validate(delivery)
            const validateBilling = address_validator.validate(billing)
            const result = await UserS.updateAddress({_id,userId,billing:validateBilling,delivery:validateDelivery,isDefault:def})
            if(result){
                return res.status(200).json({status:true,message:"Updated"})
            }else{
                throw new Error("Failed to update")
            }
       } catch (error) {
            return res.status(500).json({status:false,error:error.message})
       }
    }
    async deleteAddress(req,res){
        try {
            const {userId} = req.user;
            const {_id } = req.body;
            const result = await UserS.deleteAddress({_id})
            if(result){
                return res.status(200).json({status:true,message:"Updated"})
            }else{
                throw new Error("Failed to update")
            }
       } catch (error) {
            return res.status(500).json({status:false,error:error.message})
       }
    }

    async updateUserInfo(req,res){
        const {name,gender,code,number,dob} = req.body 
        const {userId} = req.user 
        try {
            const result = await UserS.updateUserInfo({
                userId,
                user:{
                    name,
                    gender,
                    code:code===undefined?"977":code,
                    number,
                    dob
                }
            })
           if(result){
            return res.status(200).json({status:true})
           }else{
            throw new Error("Failed to update")
           }
       } catch (error) {
        console.log(error);
            return res.status(500).json({status:false,error:error.message})
       }
    }

}

const UserC =new  UserController();
module.exports = UserC;