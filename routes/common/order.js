const OrderController = require("../../controller/order");
const { AuthenticationToken } = require("../../middleware/auth-token");

const app = require("express").Router()

app.post('/',AuthenticationToken,OrderController.createOrder)
app.patch('/payment',AuthenticationToken,OrderController.orderPaymentMethod)
app.patch('/status',AuthenticationToken,OrderController.updateOrderStatus)
app.patch('/paymentStatus',AuthenticationToken,OrderController.updatePaymentStatus)
app.get('/recent',AuthenticationToken,OrderController.getRecentOrder)
app.get('/',AuthenticationToken,OrderController.getAllOrders)
app.get('/orderdetails',AuthenticationToken,OrderController.getOrderDetailsById)
app.get('/orderdetails/store',AuthenticationToken,OrderController.getOrderDetailsByIdAndStore)
app.get('/store',AuthenticationToken,OrderController.fetchOrdersByStoreId)
app.get('/analytics/today',AuthenticationToken,OrderController.getAnalytics)

module.exports = app;