
const OrderS = require("../services/order/order");
const order_validator = require("../validation/order_validator");
const CancellationS = require("../services/order/cancellation");
const RatingS = require("../services/product/rating");
const ProductS = require("../services/product/product");
const { default: mongoose } = require("mongoose");
const { USERTYPE } = require("../common/utils");
const UpdateOrderHistoryS = require("../services/order/update_order_history");


class Order{
   /* Create an order */
    async createOrder(req,res){
        try {
            const {userId} = req.user;
            const validatedData = order_validator.validate(req.body)
            const result = await OrderS.createOrder({data:validatedData,userId})
            await ProductS.updateQuantity({products:result.products})
            if(result){
                res.status(200).json({success:true,data:result})
            }else{
                throw new Error("Failed to place order")
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                error:error.message
            })
        
        }
    }
    /*Update order status for only super admin */
    async updateOrderStatus(req,res){
        try {
            const {userId} = req.user;
            const {orderId,status} = req.body;
            if(!mongoose.Types.ObjectId.isValid(orderId)){
                throw  new Error("OrderId is not valid ")
            }
            const result =await OrderS.updateOrderStatus({orderId,userId,status})
            if(!result){
                throw new Error("Unable to change status")
            }
            await UpdateOrderHistoryS.addUpdateOrderHistory({orderId,userId,message:`Order status ${status}`})
        return  res.status(200).json({success:true,result:result}) 
        } catch (error) {
       
            res.status(500).json({
                success:false,
                error:error.message
            })
        
        }
    }

    async updatePaymentStatus(req,res){
        try {
            const {userId} = req.user;
            const {orderId,status} = req.body;
            if(!mongoose.Types.ObjectId.isValid(orderId)){
                throw  new Error("OrderId is not valid ")
            }
            const result =await OrderS.updatePaymentStatus({orderId,userId,status})
            if(!result){
                throw new Error("Unable to change status")
            }
            await UpdateOrderHistoryS.addUpdateOrderHistory({orderId,userId,message:`Payment status ${status}`})
        return  res.status(200).json({success:true,result:result}) 
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                error:error.message
            })
        
        }
    }
    /*  */
    async orderPaymentMethod(req,res){
        try {
            const {userId} = req.user;
            const {method,orderId} = req.body;
            if(method!=='COD'){
                throw new Error("Payment method not supported")
            }else{
                const result = await OrderS.setPaymentMethodCOD({userId,orderId})
                if(result){
                    res.status(200).json({success:true,data:result})
                }else{
                    throw new Error("Failed to choose payment method COD")
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                error:error.message
            })
        
        }
    }
   /* Get all the recent order as per by the userId */
    async getRecentOrder(req,res){
        try {
            const {userId} = req.user;
            const result = await OrderS.getRecentOrder({userId})
            res.status(200).json({success:true,data:result})
        } catch (error) {
            res.status(500).json({
                success:false,
                error:error.message
            })
        }
    }
    /*Get all the order by userId  */
    async getAllOrders(req,res){
        try {
            const {userId} = req.user;
            const result = await OrderS.getAllOrders({userId})
            res.status(200).json({success:true,data:result})
        } catch (error) {
            res.status(500).json({
                success:false,
                error:error.message
            })
        }
    }
       /* Get the order information according to the orderId   */
    async getOrderDetailsById(req,res){
        try {
            const {userId} = req.user;
            const {orderId,storeId} = req.query;
            let result = await OrderS.getOrderDetailsById({userId,orderId,storeId})
            if(!result){
                throw new Error("OrderId is not valid")
            }
            const cancellation = await CancellationS.getCancellationByOrderId({orderId,userId})??[]
            const reviews = await RatingS.getRateByuserId({userId,orderId})
            res.status(200).json({success:true,data:{...result._doc,cancellation,reviews}})
        } catch (error) {
            res.status(500).json({
                success:false,
                error:error.message
            })
        }
    }
    async getOrderDetailsByIdAndStore(req,res){
        try {
            const {userId} = req.user;
            const {orderId,storeId} = req.query;
            //if the user is super admin
            if(req.user.role===USERTYPE.SUPERUSER){
                let result = await OrderS.getOrderDetailsForAdmin({orderId,userId})
                if(!result){
                    throw new Error("OrderId is not valid")
                }
                const cancellation = []
                const reviews = []
               return  res.status(200).json({success:true,data:{...result._doc,cancellation,reviews}})
               }else if(!new mongoose.isValidObjectId(orderId) && !new mongoose.isValidObjectId(storeId)){
                throw new Error("Not vaid orderId or storeId")
            }
            //If the user is not admin and contains storeId 
            let result = await OrderS.getOrderDetailsByIdStore({userId,orderId,storeId})
            if(!result){
                throw new Error("OrderId is not valid")
            }
            const cancellation = await CancellationS.getCancellationByOrderId({orderId,userId})??[]
           const reviews = await RatingS.getRateByuserId({userId,orderId})
            res.status(200).json({success:true,data:{...result._doc,cancellation,reviews}})
        } catch (error) {
            res.status(500).json({
                success:false,
                error:error.message
            })
        }
    }
       /* Fetch all the orders according to the storeID */
    async fetchOrdersByStoreId(req,res){
        try {
            const {userId} = req.user;
            const {storeId} = req.query;
           if(req.user.role===USERTYPE.SUPERUSER){
            let result = await OrderS.fetchAllOrders({userId})
            return res.status(200).json({success:true,data:result})
           }else if(!mongoose.Types.ObjectId.isValid(storeId)){
                throw new Error("Store Id is required")
            }
            let result = await OrderS.fetchOrdersByStoreId({storeId,userId})
            res.status(200).json({success:true,data:result})
        } catch (error) {
            res.status(500).json({
                success:false,
                error:error.message
            })
        }
    }
    async getAnalytics(req,res){
           try {
            const {userId} = req.user;
            const {storeId} = req.query;
            const today = new Date()
            today.setHours(0,0,0)
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1); 
            //check the user role
            if(req.user.role===USERTYPE.SUPERUSER){
                const totalOrders = await OrderS.getTotalOrdersForAdmin({startDate:today,endDate:tomorrow,userId})
                const totalUser = await OrderS.getTotalUsersForAdmin({startDate:today,endDate:tomorrow,userId})  
                const totalStatus = await OrderS.getTotalStatusForAdmin({startDate:today,endDate:tomorrow,storeId,userId})
                return res.status(200).json({success:true,data:{...totalOrders,...totalUser,...totalStatus}})
            }else{
                const totalOrders = await OrderS.getTotalOrders({startDate:today,endDate:tomorrow,storeId,userId})
                const totalUser = await OrderS.getTotalUsers({startDate:today,endDate:tomorrow,storeId,userId})  
                const totalStatus = await OrderS.getTotalStatus({startDate:today,endDate:tomorrow,storeId,userId})
                return res.status(200).json({success:true,data:{...totalOrders,...totalUser,...totalStatus}})
            }
           } catch (error) {
            console.log(error);
            res.status(500).json({
                success:false,
                error:error.message
            }) 
           }
    }
 

}

const OrderController = new Order()
module.exports = OrderController;