// for handling multipart/form-data (for uploading files)
const multer = require("multer")
const fs = require("fs")
const { generateHash } = require("../common/utils")
const path = require("path")
const { compressImageAndSave } = require("../common/compress")
const rootDir = 'assets'
const allowedMimeTypeMedia = [
    "image/jpg","image/jpeg","image/png","image/gif",
    "video/mp4","video/avi"
]
const allowedMimeType = [
    "image/jpg","image/jpeg","image/png","image/gif"
]

if(!fs.existsSync(rootDir)) fs.mkdirSync(rootDir)
const extension = (mimeType)=> mimeType.split('/')[1]
//storage for files 
let storageMedia =(directory)=> multer.diskStorage({
    destination: (req,file,cb)=>{
        let dir = `${rootDir}/${directory}`
        if(!fs.existsSync(dir))fs.mkdirSync(dir,{recursive:true})
        cb(null,dir)
    },
    filename:(req,file,cb)=>{
        let {username} = req.user
        if(!allowedMimeTypeMedia.includes(file.mimetype)) {
           return cb(new Error("File extension not allowed"))
        }
        let filename = `${generateHash(username)}.${extension(file.mimetype)}`
        cb(null,filename)
    }
}) 

let storage =(directory)=> multer.diskStorage({
    destination: (req,file,cb)=>{
        let dir = `${rootDir}/${directory}`
        if(!fs.existsSync(dir))fs.mkdirSync(dir,{recursive:true})
        cb(null,dir)
    },
    filename:(req,file,cb)=>{
        let {username} = req.user
        if(!allowedMimeType.includes(file.mimetype)) {
           return cb(new Error("File extension not allowed"))
        }
        let filename = `${generateHash(username)}.${extension(file.mimetype)}`
        cb(null,filename)
    }
}) 

const uploadProfile = multer({ storage: storage("images/profile") ,
    limits:{
        files:1
    }
}).single('profile')

const uploadStoreLogo = multer({ storage: storage("images/logo") ,
    limits:{
        files:1
    }
}).single('logo')
const uploadProductMedia = multer({storage:storageMedia("images/media"),
limits:{
    files:7,
}
}).array('media')


const compressAndReturnUrlMiddleware =async (req,res,next)=>{
    try {
        
    let files = req.file || req.files
    console.log(files);
    let url = []
    if(!files instanceof Array ||!Array.isArray(files)){
        files =[files]
    }
    for(let file of files){
        const {destination,filename} = file
        let currentUrl = await compressImageAndSave(destination,filename)
        url.push(currentUrl)
    }

    req.uploadedUrl = url 
    next()
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,messagee:"Internal server error"})
    }
}


module.exports = {compressAndReturnUrlMiddleware,uploadProfile,uploadProductMedia,uploadStoreLogo}