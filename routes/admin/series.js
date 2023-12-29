const Series = require("../../controller/series")
const { AuthenticationToken } = require("../../middleware/auth-token")

const app = require("express").Router()

app.post("/",AuthenticationToken,Series.createSeries)
app.get("/",Series.fetchAllSeriesByStoreId)
app.get("/all",Series.fetchAllSeries)
app.delete("/",AuthenticationToken,Series.deleteSeries)
module.exports = app 