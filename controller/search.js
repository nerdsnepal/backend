const { removeAttribute } = require("../common/user.hide.secrete");
const productModel = require("../models/product-model");

/*Search Products according to the name,description, category name,subcategory, seo title and descriptions */
exports.searchProducts=async(query)=> {
    try {
       query= query.replace(/[^a-zA-Z0-9- ]/g, "")
       //console.log(query);
      let products = await productModel.find({
        $or: [
          { name: { $regex: query, $options: 'i' } }, 
          { description: { $regex: query, $options: 'i' } },
          { 'category.name': { $regex: query, $options: 'i' } },
          { 'category.subcategory': { $elemMatch: { $regex: query, $options: 'i' } } }, 
          { 'seo.title': { $regex: query, $options: 'i' } }, 
          { 'seo.description': { $regex: query, $options: 'i' } },
        ],
      });
      if(products){
        products = removeAttribute(products,['created_by','returns_count','sales_count','created_at','updated','costPrice','__v','views_count'])
    }
      return products;
    } catch (error) {
      console.error('Error searching for products:', error);
      throw error;
    }
  }