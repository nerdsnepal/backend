const { addTotalQuantityForProduct } = require("../common/products");
const { removeAttribute } = require("../common/user.hide.secrete");
const productModel = require("../models/product-model");



exports.trendProductBasedOnViews = async()=>{
    try {
        let trendingProducts = await productModel.aggregate([
            { $match: { status: true } }, 
            { $sort: { views_count: -1 } }, 
            { $limit: 5 } 
        ]);
        if(trendingProducts){
            trendingProducts = removeAttribute(trendingProducts,['created_by','returns_count','sales_count','created_at','updated','costPrice','__v','views_count'])
           // trendingProducts = addTotalQuantityForProduct(trendingProducts)
        }
        return trendingProducts;
    } catch (error) {
        // Handle any errors
        console.error('Error fetching trending products based on views:', error);
        throw error;
    }
}