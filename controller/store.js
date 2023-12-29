const { removeAttribute } = require("../common/user.hide.secrete")
const { isEmpty } = require("../common/utils")
const StoreModel = require("../routes/admin/store/model/storemodel")
const ProductS = require("../services/product/product")
const StoreS = require("../services/store/store")



class StoreController {
    storeById = async({storeId})=>{
        let store = await StoreModel.findOne({_id:storeId})
        if(store){
            store = removeAttribute([store],['created_by','creation_date','paymentMethod','websiteLayout','subscriptionDetails','__v','updateHistory'])
        }
        return store[0]
    }
    async getStoreById(req,res){
        try {
        const {id} = req.query;
        if(isEmpty(id)){
            throw new Error("Store id can't be null")
        }   
        const store  = await StoreS.getById({storeId:id});
        const categories = await ProductS.getCategoryByStoreId({storeId:id})
        const products = await ProductS.getProductByStoreId({storeId:id})
        res.status(200).json({success:true,data:{
            store,
            categories,
            products
        }})
        } catch (error) {
            res.status(500).json({success:false,error:error.message})
        }

    }
}

const Store = new StoreController();

module.exports = Store;