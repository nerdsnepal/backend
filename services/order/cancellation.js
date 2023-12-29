const Cancellation = require("../../models/cancellation")

class CancellationService {
    addCancellation(){}
    async  getCancellationByOrderId({orderId,userId}) {
        return  await Cancellation.findOne({orderId:orderId,userId})
    }

}

const CancellationS = new CancellationService()

module.exports = CancellationS