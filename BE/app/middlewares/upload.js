import multer from "multer"
import path, { join } from "path"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filter = (req,file,cb) => {
    // const allowedExtension = [".pdf"]
    // const regex = new RegExp(allowedExtension.join("|"),"i")
    const fileExtension = path.extname(file.originalname)
    console.log(fileExtension);
    if (/\.pdf/g.test(fileExtension)) {
        // console.log("you are allowed to upload file");
        cb(null,true)
    } else {
        // console.log("you are not allowed to upload file");
        cb(new Error("Your file is not allowed"),false)
    }
}

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        
        cb(null,path.join(__dirname, "../uploads" ))
    },
    filename: (req,file,cb) => {
        cb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}` )
        console.log(__dirname);
    }
})

export const upload = multer({storage , fileFilter: filter})