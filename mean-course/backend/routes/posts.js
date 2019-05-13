const express = require('express');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const Post = require('../models/post');

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

router.post('',checkAuth,multer({storage:storage}).single("image"),(req,res,next)=>{
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title:req.body.title,
        content:req.body.content,
        imagePath:url + '/images/' + req.file.filename,
        creator:req.userData.userId,
    });
    post.save().then((result)=>{
        res.status(201).json({
            message: 'Post added',
            post:{
                ...result,
                id:result._id,
            }
        });
    })
    .catch(err=>{
        res.status(500).json({
            message:'Post creation failed',
        });
    });
});

router.get('',(req,res,next)=>{
    const pageSize = +req.query.pageSize;
    const curPage = +req.query.curPage;
    const postQuery = Post.find();
    let docs;
    if(pageSize && curPage){
        postQuery
            .skip(pageSize * (curPage - 1))
            .limit(pageSize);
    }
    postQuery.then(documents => {
        docs = documents;
        return Post.count();
    }).then(count => {
        res.status(200).json({
            message:'Posts fetched successfully',
            posts:docs,
            maxPosts:count,
        });
    })
    .catch(err => {
        res.status(500).json({
            message:'Fetching posts failed',
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
        })
        .catch(err => {
            res.status(500).json({
                message:'Fetching post failed',
            });
        });
})

router.put('/:id',checkAuth,multer({storage:storage}).single("image"),(req,res,next)=>{
    let imagePath = req.body.imagePath;
    if(req.file){
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }
    const updatedPost = new Post({
        _id:req.body.id,
        title:req.body.title,
        content:req.body.content,
        imagePath:imagePath,
        creator:req.userData.userId,
    });
    Post.updateOne({_id:req.params.id,creator:req.userData.userId},updatedPost)
        .then((result) => {
            if(result.nModified > 0){
                res.status(201).json({
                    message:'Post updated successfully.'
                })
            } else {
                res.status(401).json({
                    message:'You are not authorized to update this post.'
                })
            }
        })
        .catch(err=>{
            res.status(500).json({
                message:'Could not update post',
            });
        });
})

router.delete("/:id",checkAuth,(req,res,next)=>{
    Post.deleteOne({
        _id:req.params.id,
        creator:req.userData.userId,
    }).then((result)=>{
        if(result.n > 0){
            res.status(201).json({
                message:'Post deleted successfully.'
            })
        } else {
            res.status(401).json({
                message:'You are not authorized to delete this post.'
            })
        }
    }).catch((err)=>{
        res.status(500).json({
            message:'Post deletion failed',
        });
    })
    res.status(200).json({
        message:'Post deleted',
    });
});

module.exports = router;