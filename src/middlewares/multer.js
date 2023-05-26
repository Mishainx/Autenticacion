import multer from "multer";
import { __dirname } from "../config/utils.js";

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        console.log(req.files)
        switch(file.fieldname){
            case "profiles":
                cb(null,__dirname+"/public/files/profiles")
            break
            case "products":
                cb(null,__dirname+"/public/files/products")
            break
            case "documents":
                cb(null,__dirname+"/public/files/documents")
            break
            case "identification":
                cb(null,__dirname+"/public/files/documents")
            break
            case "residence":
                cb(null,__dirname+"/public/files/documents")
            break
            case "account":
                cb(null,__dirname+"/public/files/documents")
            break
        }
    },
    filename: function(req,file,cb){
        cb(null,file.originalname)
    }
})

export const uploader = multer({storage},);