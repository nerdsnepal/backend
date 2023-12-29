const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cluster = require("cluster");
const  os = require("node:os");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const createAdminRoute = require("./routes/admin/user");
const userAccountRoute = require("./routes/client/user");
const userAuthRoute = require("./routes/client/auth");
const categoryRoute = require("./routes/admin/category");
const { uploadProductMedia } = require("./middleware/upload-middleware");
const { AuthenticationToken } = require("./middleware/auth-token");
const path = require("path");
const { compressImageAndSave} = require("./common/compress");
const imageRoute = require("./routes/common/imageroute");
const userAvatarRoute = require("./routes/common/userprofile");
const cors = require("cors");
const rootRoute = require("./routes/client/root")
const productClientRoute = require("./routes/client/products")
const storeRoute = require("./routes/admin/store/store");
const searchRoute = require("./routes/common/search");
const uploadRoute = require("./routes/upload/uploadmedia");
const productRoute = require("./routes/admin/products");
const adminSeriesRoute = require("./routes/admin/series");
const ratingRoute =require("./routes/client/rating")
const trendingProductRoute = require("./routes/client/trending.products")
const orderRoute = require("./routes/common/order")
const {CheckAPIAcessToken} = require("./middleware/check_api_token");
const { metaData } = require("./middleware/meta-data");
// number of cpu or core available 
const numCPUS = os.cpus().length;



// Middleware 
app.use('*',cors({
    origin:true,
    credentials:true
}));
app.set('assets', path.join(__dirname, 'assets'));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(metaData)


//handle routes
app.use('/assets/images',imageRoute);
//app.use(CheckAPIAcessToken);
//root 
app.use('/',rootRoute)
app.use('/order',orderRoute)
app.use("/admin/create/",createAdminRoute);
app.use("/admin/series",adminSeriesRoute)
app.use("/store",storeRoute);
app.use("/account/",userAccountRoute);
app.use("/auth/",userAuthRoute);
app.use("/admin/category",categoryRoute);
app.use('/product/',productRoute)
app.use("/products",productClientRoute)
app.use("/user/profile",userAvatarRoute);
app.use("/search",searchRoute);
app.use("/upload",uploadRoute);
app.use("/trending/",trendingProductRoute)
app.use("/rating/",ratingRoute)

app.post("/media",AuthenticationToken,uploadProductMedia,async(req,res)=>{
    const files = req.files;
    try {
        for (let file of files) {
            const {destination,filename} = file;
            console.log(file);
            console.log(await compressImageAndSave(destination,filename));
        }
    } catch (error) {
        console.log(error);
    }
    res.send(req.file);
});

//connection to the mongodb
mongoose.connect(process.env.MONGO_CONNECTION_STRING).then(()=>{
    console.log("Connection successful");
})
.catch((err)=>{
    console.log(err.message);
    console.log("Connection failed");
});

// start the primary process 
if(cluster.isPrimary){
    for(let i=0;i<numCPUS;i++)cluster.fork()
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
      });
}else{
    //listening to the port 
    app.listen(process.env.PORT||5000,()=>{
        console.log("Hey I am listening you!!");
    })
    console.log(`Worker ${process.pid} started`);
}
