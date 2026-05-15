import multer from 'multer';
import path from "path";
const storage = multer.diskStorage({
    filename:(req,file,cb) =>{
        const ext = path.extname(file.originalname ||"").toLowerCase();
        const safeExt = [".jpg",".jpeg",".png",".webp"].includes(ext) ? ext : "";
        const unique = `${Date.now()}-${Math.round(Math.random()*1E9)}`;
        cb(null,`${unique}${safeExt}`);
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
export const upload = multer({
  storage,
  fileFilter,
  limits:{fileSize:5*1024*1024} //5MB
})