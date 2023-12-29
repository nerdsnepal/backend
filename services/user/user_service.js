const { isEmpty } = require("../../common/utils");
const Address = require("../../models/address");
const userModel = require("../../models/user-model");

class UserService {

  async  getUserById(userId){
        return await userModel.findOne({_id:userId},'_id name username email isVerified profile address role gender');
    }
    async getUserAddressByUserId(userId){
        return await Address.find({userId:userId})
    }
async addAddress({userId,address}){
    return await Address({
        default:false,
        userId:userId,
        billing:address,
        delivery:address
    }).save()
}
async updateAddress({userId,billing,delivery,isDefault,_id}){
    if(isDefault){
        await Address.updateMany({userId},{default:false})
    }
    return await Address.updateOne({_id,userId},{
        default:isDefault,
        billing:{...billing},
        delivery:{...delivery}
    })
}
async deleteAddress({_id}){
    return await Address.deleteOne({_id})
}

async updateUserInfo({userId,user}){
    if(isEmpty(user.name)){
        throw new Error("Name is required");
    }
    return await userModel.updateOne({_id:userId},{
        $set:{
            "name":user.name,
            "gender":user.gender,
            "dob":user.dob,
            "phone.code":user.code,
            "phone.number":user.number,
        }
    })
}

}



const UserS = new UserService();
module.exports = UserS;