const express = require('express');
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/jpg':'jpg',
    'image/jpeg':'jpg',
    'image/gif':'gif',
    'image/bmp':'bmp',
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

router.post('',(req,res,next)=>{
    const post = new Post({
        title:req.body.title,
        content:req.body.content,
    });
    post.save().then((result)=>{
        res.status(201).json({
            message: 'Post added',
            postId:result._id,
        });
    });
});

router.get('',(req,res,next)=>{
    Post.find((err,results)=>{
        if(err){throw err}
    }).then(documents => {
        res.status(200).json({
            message:'Posts fetched successfully',
            posts:documents,
        });
    });
});

router.get('/:id',(req,res,next)=>{
    Post.findById(req.params.id)
        .then(post => {
            if(post){
                res.status(200).json(post);
            } else {
                res.status(404).json({
                    message:'Post not found'
                });
            }
        });
})

router.put('/:id',(req,res,next)=>{
    const updatedPost = new Post({
        _id:req.body.id,
        title:req.body.title,
        content:req.body.content
    });
    Post.updateOne({_id:req.params.id},updatedPost)
        .then((result) => {
            res.status(201).json({
                message:'Post updated successfully'
            })
        });
})

router.delete("/:id",(req,res,next)=>{
    Post.deleteOne({
        _id:req.params.id,
    }).then((result)=>{
        //console.log(result)
    }).catch((err)=>{throw err})
    res.status(200).json({
        message:'Post deleted',
    });
});

module.exports = router;