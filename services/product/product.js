const CategoryModel = require("../../models/categorymodel");
const productModel = require("../../models/product-model");

class ProductService {
    async getProductByStoreId({storeId}){
        return await productModel.find({storeId:storeId});
    }
    async getCategoryByStoreId({storeId}){
        return await CategoryModel.find({storeId:{$in:[null,storeId]},status:true});
    }
    
    async getAllProductsBySeriesId({seriesId}){
        return await productModel.find({seriesId});
    }
    async updateQuantity({products}){
            try {
              const bulkOps = products.map(({ productId, quantity }) => ({
                updateOne: {
                  filter: { _id: productId },
                  update: { $inc: { 'inventory.quantities.0.quantity': -quantity } }
                }
              }));
          
              const result = await productModel.bulkWrite(bulkOps);
              return result;
            } catch (err) {
              console.error(err);
              throw err;
            }
    }

}


const ProductS = new ProductService();

module.exports = ProductS;