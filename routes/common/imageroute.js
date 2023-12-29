const app = require("express").Router()
const fs = require("fs");
const sharp = require("sharp");

const compressImage = ({path,quality})=>{
    const dir = 'assets/compress/'
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir,{recursive:true})
    }
    const outputFile = `${dir}/compressed.png`
    const resolution = 2000
   return sharp(path).resize(resolution)
    .jpeg({ mozjpeg: true,quality:quality })
    .toFile(outputFile, (err, info) => {
        if (err) {
         return null
        } else {
         return outputFile
        }
      });
}

app.get("/:dirname/:filename",(req,res)=>{
    const {dirname,filename} = req.params;
    const quality = Number(req.query.q)||100 
    let filePath = `${process.cwd()}/assets/images/${dirname}/${filename}`
   if(req.query.q){
    if(compressImage({path:filePath,quality})){
        filePath =`${process.cwd()}/assets/compress/compressed.png`  
     }
   }
    if(!fs.existsSync(filePath)){
        return res.status(422).json({status:false,message:"resource not found"})
    }else{
        res.status(200)
        const createReadStream = fs.createReadStream(filePath)
        res.writeHead(200,{'Content-Type':'image/*'})
        createReadStream.pipe(res)
    }
    
})

module.exports = app 