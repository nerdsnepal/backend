const SeriesModel = require("../../models/series-model");
class SeriesService{
    async createSeries({name,images,status,userId,storeId}){
        if(await SeriesModel.findOne({storeId,name})){
            throw new Error("Series already exists")
        }
        //check other authorize
       return await SeriesModel({name,images,status,created_by:userId,storeId}).save()
    }
    async fetchAllSeriesByStoreId({storeId}){
        return await SeriesModel.find({storeId})
    }
    
    async fetchAllSeries(){
        return await SeriesModel.find({});
    }
    async deleteSeries  ({userId,storeId,seriesId}){
        //check authorize or not 
        return await SeriesModel.deleteOne({storeId,_id:seriesId})
    }

}
const SeriesS = new SeriesService();
module.exports = SeriesS