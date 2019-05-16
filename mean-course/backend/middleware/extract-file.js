const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/jpg':'jpg',
    'image/jpeg':'jpg',
}
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        const isValid = MIME_TYPE_MAP[file.mimetype]
        let error = new Error("Invalid MIME type");
        if(isValid){
            error = null
        }
        cb(error, "images");
    },
    filename:(req,file,cb)=>{
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        const fileName = `${name}-${Date.now()}.${ext}`;
        cb(null,fileName)
    }
});

module.exports = multer({storage:storage}).single("image");