import multer from 'multer';
import path from "path";
const storage = multer.diskStorage({
    filename:(req,file,cb) =>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
}) 

//filtering the file type

const fileFilter = (req,file,cb)=>{
    const allowedTypes = /jpeg|jpg|png|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimeType = allowedTypes.test(file.mimeType);
    if(extname &&mimeType){
        cb(null,true);
    }else{
        cb(new Error("only images are allowed (jpeg,jpg,png,webp)"));
    }
}