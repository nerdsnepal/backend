const UpdateOrderHistory = require("../../models/update_order_history");

class UpdateOrderHistoryService {

     addUpdateOrderHistory= async({orderId,message,userId})=>{
        return await UpdateOrderHistory({
            orderId,
            message,
            userId
        }).save()
    }

}

const UpdateOrderHistoryS = new UpdateOrderHistoryService();
module.exports = UpdateOrderHistoryS