const express = require('express');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const postController = require('../controllers/posts');

const router = express.Router();

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
        cb(error, "backend/images");
    },
    filename:(req,file,cb)=>{
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        const fileName = `${name}-${Date.now()}.${ext}`;
        cb(null,fileName)
    }
});

router.post('',checkAuth,multer({storage:storage}).single("image"),postController.createPost);
router.get('',postController.getAllPosts);
router.get('/:id',postController.getSinglePost);
router.put('/:id',checkAuth,multer({storage:storage}).single("image"),postController.updatePost)
router.delete("/:id",checkAuth,postController.deletePost);

module.exports = router;