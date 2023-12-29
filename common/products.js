

const addTotalQuantityForProduct = (products)=>{
    let newProducts = [];
    for (let {_doc} of products) {
    let totalQuantity = 0;
  
    _doc?.inventory?.quantities.map(({quantity})=>{
        totalQuantity+=Number(quantity);
    })
    _doc.totalQuantity = totalQuantity;
    _doc.isAvailable = totalQuantity>0?true:false;
       newProducts.push(_doc);
    }
    products._doc = newProducts;
    return products;
}
const minMax = (products)=>{
    let prices = []
    for (let {_doc} of products) {
        const {mrp} = _doc.price
        prices.push(mrp)
    }
    prices.sort(function(a, b){return a - b});
    if(prices.length>0)
    return {min:prices[0],max:prices[prices.length-1]}
    return {min:0,max:0}
}

const removeSensativeContent = (products)=>{

    let newProducts = [];
    for (let {_doc} of products) {
        _doc.updated = undefined;
        _doc.created_at = undefined; 
        _doc.created_by= undefined;
        _doc.costPrice = undefined;
    }
    products._doc = newProducts;
    return  products;
}

module.exports = {
    addTotalQuantityForProduct,
    removeSensativeContent,
    minMax
}