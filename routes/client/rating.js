const RatingC = require("../../controller/rating")
const { AuthenticationToken } = require("../../middleware/auth-token")

const app = require("express").Router()

app.post("/",AuthenticationToken,RatingC.rate)
app.get("/",RatingC.getReview)
module.exports = app 