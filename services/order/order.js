const { generateProductSignature, USERTYPE } = require("../../common/utils");
const Order = require("../../models/orders");
const StoreModel = require("../../routes/admin/store/model/storemodel");
const userModel = require("../../models/user-model");


class OrderService {

    createOrder= async({data,userId}) =>{
      const fee = this._checkDeliveryCharge({address:data.deliveryAddress.city})
      if(fee!==data.deliveryCharge){
        data.deliveryCharge=fee;
      }
        return await  Order({
            ...data,
            userId,
            signature:generateProductSignature(data.products,userId)
        }).save();
    }

    _checkDeliveryCharge=({address})=>{
      let fee=160;
      const pattern = /kathmandu/i;
      if(pattern.test(address)){
        fee=120;
      }
      return fee;
   }

    /*Update the order status  */
    updateOrderStatus = async ({orderId,userId,status})=>{
     await this._checkPriviledgeSuperAdmin({userId})
     if(await Order.findOne({_id:orderId,status:"Delivered"})){
      throw new Error("Not able to change status after product delivered!!!")
     }
      return await Order.findOneAndUpdate({_id:orderId},{status:status});
    }
    updatePaymentStatus = async ({orderId,userId,status})=>{
      await this._checkPriviledgeSuperAdmin({userId})
      return await Order.findOneAndUpdate({_id:orderId},{paymentStatus:status});
     }


    setPaymentMethodCOD = async ({userId,orderId})=>{
       const result = await Order.findOne({_id:orderId,userId:userId})
        if(result.paymentMethod==='None'){
            result.paymentMethod='Cash on Delivery';
        }else{
            throw new Error(`You have chosen ${result.paymentMethod} as your payment method and the payment status is ${result.paymentStatus}.`)
        }
        return result.save();
        
    }
    getRecentOrder = async({userId})=>{
        return await Order.find({userId,paymentMethod:{
            $ne:"None"
        }}).sort({createdAt: -1}).limit(3)
    }
    getAllOrders = async ({userId})=>{
        return   await Order.find({userId,paymentMethod:{
            $ne:"None"
        }}).sort({createdAt: -1})
    }
    getOrderDetailsById= async({userId,orderId})=>{
        const order= await Order.findOne({_id:orderId,userId})
        .populate("userId","_id name username profile email")
        .populate("storeId","_id logo name");
        return order
    }
   async _checkPriviledge({storeId,userId}){
   //check the userId is authorized or not to the store 
    if(!await StoreModel.findOne({_id:storeId,merchantId:userId})){
      throw new Error("Unauthrozied access")
      }
    }
    getOrderDetailsByIdStore= async({userId,orderId,storeId})=>{
     await this._checkPriviledge({storeId,userId})
      //...
      const order= await Order.findOne({_id:orderId,'products.storeId':storeId})
      .populate("userId","_id name username profile email isVerified")
      .populate("storeId","_id logo name");
      order.products= order.products.filter((product)=>product.storeId.toString()===storeId)
      return order
  }
  getOrderDetailsForAdmin= async({userId,orderId})=>{
    await this._checkPriviledgeSuperAdmin({userId})
     //...
     const order= await Order.findOne({_id:orderId})
     .populate("userId","_id name username profile email isVerified")
     .populate("storeId","_id logo name");
     return order
 }

    async fetchOrdersByStoreId({storeId,userId}) {
        try {
            const orders = await Order.find({
                'products.storeId': storeId
              }).populate("userId","_id name profile").sort({createdAt:-1});
          orders.map((order)=>{
            order.products = order.products.filter(product => product.storeId.toString() === storeId);
            return order;
          })
            // 
          return orders;
        } catch (error) {
          // Handle error here
          console.error('Error fetching orders:', error);
          throw error;
        }
    }
    async getTotalOrders({startDate,endDate,storeId,userId}){
     await this._checkPriviledge({storeId,userId}) 
     let totalOrder=0,totalQuantity=0;
      const orders = await Order.find({'products.storeId':storeId,createdAt:{
        $lt:endDate,
        $gt:startDate
      }
    })
      if(orders){
        orders.map((order)=>{
          totalOrder+=1;
            order.products.map(({storeId,quantity})=>{
              if(storeId===storeId){
                totalQuantity +=quantity; 
              }
              
            })
        })
      }
      return {totalOrder,totalQuantity}
    }
    /* g=get the totalOrder for super admin only */
    async getTotalOrdersForAdmin({startDate,endDate,userId}){
      await this._checkPriviledgeSuperAdmin({userId}) 
      let totalOrder=0,totalQuantity=0;
       const orders = await Order.find({createdAt:{
         $lt:endDate,
         $gt:startDate
       }
     })
       if(orders){
         orders.map((order)=>{
           totalOrder+=1;
             order.products.map(({quantity})=>{
                 totalQuantity +=quantity; 
             })
         })
       }
       return {totalOrder,totalQuantity}
     }
    async getTotalUsers ({storeId,startDate,endDate,userId}){
      await this._checkPriviledge({storeId,userId}) 
      const todayCustomerIds = await Order.distinct('userId', {
        createdAt: { $gte: startDate, $lte: endDate },
        'products.storeId':storeId
      });
      return  {users:todayCustomerIds}
    }
    async getTotalUsersForAdmin ({startDate,endDate,userId}){
      await this._checkPriviledgeSuperAdmin({userId}) 
      const todayCustomerIds = await Order.distinct('userId', {createdAt: { $gte: startDate, $lte: endDate }});
      return  {users:todayCustomerIds}
    }
    
    async getTotalStatus ({storeId,startDate,endDate,userId}){
      await this._checkPriviledge({storeId,userId}) 
      let totalCancellation=0,totalPending=0,totalDeliverd=0,totalShipped=0,totalProcessing=0;
       const orders = await Order.find({'products.storeId':storeId,createdAt:{
         $lt:endDate,
         $gt:startDate
       }
     })
       if(orders){
         orders.map((order)=>{
          if(order.status==="Cancelled"){
             totalCancellation+=1;
          }else if(order.status==="Pending"){
            totalPending+=1;
          }else if(order.status==="Delivered"){
            totalDeliverd+=1;
          }else if(order.status==="Shipped"){
            totalShipped+=1;
          }else{
            totalProcessing+=1;
          }
         })
       }
       return {totalCancellation,totalPending,totalDeliverd,totalShipped,totalProcessing}
    }
    async getTotalStatusForAdmin ({startDate,endDate,userId}){
      await this._checkPriviledgeSuperAdmin({userId}) 
      let totalCancellation=0,totalPending=0,totalDeliverd=0,totalShipped=0,totalProcessing=0;
       const orders = await Order.find({createdAt:{
         $lt:endDate,
         $gt:startDate
       }
     })
       if(orders){
         orders.map((order)=>{
          if(order.status==="Cancelled"){
             totalCancellation+=1;
          }else if(order.status==="Pending"){
            totalPending+=1;
          }else if(order.status==="Delivered"){
            totalDeliverd+=1;
          }else if(order.status==="Shipped"){
            totalShipped+=1;
          }else{
            totalProcessing+=1;
          }
         })
       }
       return {totalCancellation,totalPending,totalDeliverd,totalShipped,totalProcessing}
    }
  async  _checkPriviledgeSuperAdmin({userId}){
      if(!await userModel.findOne({_id:userId,role:USERTYPE.SUPERUSER})){
       throw  new Error("Unauthorized access !!!")
    } 
    }
    async fetchAllOrders({userId}) {
   await   this._checkPriviledgeSuperAdmin({userId});
      return await Order.find()
      .populate("userId","_id name profile")
      .sort({createdAt:-1});
    
  }
    

}
const OrderS = new OrderService()
module.exports = OrderS;