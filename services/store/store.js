const StoreModel = require("../../routes/admin/store/model/storemodel");

class StoreService {
    async getById({storeId}){
        return StoreModel.findOne({_id:storeId},'created_by creation_date name displayName about emails logo address')
    }


}

const StoreS = new StoreService();


module.exports = StoreS;