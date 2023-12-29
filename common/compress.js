const sharp = require("sharp");
const fs = require("fs");
const compressProfileAndSave =   (destination,filename)=>{
    const path =`${destination}/${filename}`;
   return sharp(path).resize(500)
    .jpeg({ mozjpeg: true ,quality:100})
    .toBuffer()
    .then((res)=>{
        fs.unlinkSync(path)
        fs.writeFileSync(path,res);
        return path
    }).catch((err)=>{
        console.log(err);
        return null
    })
}
const compressImageAndSave = (destination,filename)=>{
    const path =`${destination}/${filename}`;
   return sharp(path).resize(2000)
    .jpeg({ mozjpeg: true,quality:60 })
    .toBuffer()
    .then((res)=>{
        fs.unlinkSync(path)
        let newFilePath = `${destination}/${filename.split('.')[0]}.png`
        fs.writeFileSync(newFilePath,res)
        return newFilePath
    }).catch((err)=>{
        return null;
    })
}
const checkExistsAndDelete = (path) =>{
    if(fs.existsSync(path)){
        return fs.unlinkSync(path);
    }
    return false;
}
module.exports = {checkExistsAndDelete,compressProfileAndSave,compressImageAndSave}