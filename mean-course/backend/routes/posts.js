const express = require('express');
const Post = require('../models/post');

const router = express.Router();

router.post('/api/posts',(req,res,next)=>{
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

router.put('/api/posts/:id',(req,res,next)=>{
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

router.get('/api/posts',(req,res,next)=>{
    Post.find((err,results)=>{
        if(err){throw err}
    }).then(documents => {
        //console.log(documents);
        res.status(200).json({
            message:'Posts fetched successfully',
            posts:documents,
        });
    });
});

router.get('/api/posts/:id',(req,res,next)=>{
    Post.findById(req.params.id)
        .then(post => {
            if(post){
                res.status(200).json({
                    message:'Post found',
                    post:post
                })
            } else {
                res.status(404).json({
                    message:'Post not found'
                })
            }
        });
})

router.delete("/api/posts/:id",(req,res,next)=>{
    Post.deleteOne({
        _id:req.params.id,
    }).then((result)=>{
        console.log(result)
    }).catch((err)=>{throw err})
    res.status(200).json({
        message:'Post deleted',
    });
});

module.exports = router;