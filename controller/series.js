const SeriesS = require("../services/series/series");

class SeriesController{
    async createSeries(req,res){
        try {
            const {name,status,urls,storeId} =req.body
            const date = Date.now();
            const {userId} =req.user; 
            let images = []
            for(const url of urls){
                images.push({url,uploaded_by:userId,uploaded_at:date})
            }
            await SeriesS.createSeries({name,images,status,storeId,userId})
            return res.status(200).json({success:true,message:"Series Added"})
        } catch (error) {
           return res.status(500).json({success:false,message:error.message})
        }

    }
    async fetchAllSeriesByStoreId(req,res){
        try {
            const {storeId} =req.query;
            const data= await SeriesS.fetchAllSeriesByStoreId({storeId})
            return res.status(200).json({success:true,data})
        } catch (error) {
           return res.status(500).json({success:false,message:error.message})
        }

    }
    async fetchAllSeries(req,res){
        try {
            const data= await SeriesS.fetchAllSeries();
            return res.status(200).json({success:true,data})
        } catch (error) {
           return res.status(500).json({success:false,message:error.message})
        }

    }
    async deleteSeries(req,res){
        try {
            const {storeId,seriesId} =req.body;
            const {userId}=req.user;
            const data= await SeriesS.deleteSeries({storeId,userId,seriesId})
           // console.log(data);
            return res.status(200).json({success:true,message:"Deleted"})
        } catch (error) {
           return res.status(500).json({success:false,message:error.message})
        }
    }

}

const Series = new SeriesController();

module.exports = Series;