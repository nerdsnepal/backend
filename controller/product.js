const productModel = require("../models/product-model")


exports.getAllProductsyStatus =async ({userId,status=true})=>{
    if(userId){
        //get the userId according to the user 
        return await productModel.find({status}).sort({ created_at: -1 }).exec()
    }
    return await productModel.find({status}).sort({ created_at: -1 }).exec()
}
/*Filter product according to the price and category */
exports.getFilteredProducts =async ({userId=null,status=true,query={category:{},min:0,max:0}})=>{
    let filter = {status};
    if(query?.category!=='undefined'){
        const categoryFilter = {
            $or: [
                { category: { $in: query.category.split(',') } },
                { subcategory: { $in: query.category.split(',') } } // Assuming subcategories are stored in the 'subcategory' field
            ]
        };
        filter={...filter,...categoryFilter}
    }
    //applying price range 
    if (Number(query.min) >= 0 || Number(query.max) > 0) {
        let priceFilter = {};

        if (query.min > 0) {
            priceFilter.$gte = query.min;
        }

        if (query.max > 0) {
            priceFilter.$lte = query.max;
        }

        filter = { ...filter, ...{ mrp: priceFilter } };
    }
    if(userId){
        //get the userId according to the user 
        return await productModel.find(filter).sort({ created_at: -1 }).exec()
    }
    return await productModel.find(filter).sort({ created_at: -1 }).exec()
}

exports.getProductById=async ({userId,status=true,_id})=>{
    const update = { $inc: { views_count: 1 } };
    if(userId){
        //get the userId according to the user 
        return await productModel.findOneAndUpdate({status,_id},update) 
    }
    return await productModel.findOneAndUpdate({status,_id},update) 
}

exports.getAllProductByStoreId =async ({userId,status=true,storeId})=>{
    if(userId){
        //get the userId according to the user 
        return await productModel.find({status,storeId}).sort({ created_at: -1 }).limit(15).exec()
    }
    return await productModel.find({status,storeId}).sort({ created_at: -1 }).limit(15).exec()
}
//get product by category
exports.findProductsByCategory = async (categoryName, subcategoryName='',userId) => {
    try {
        const categoryFilter = {
            status:true,
            $or: [
                { 'category.name': categoryName },
               { 'category.subcategory': { $in: subcategoryName.split(',') } }
            ]
        };
      const products = await productModel.find(categoryFilter)
      return products;
    } catch (error) {
      console.log('Error finding products:', error);
      throw error;
    }
  };