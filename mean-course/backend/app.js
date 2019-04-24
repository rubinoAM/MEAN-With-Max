const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');
const mongoUrl = require('./config');

const app = express();
mongoose.connect(mongoUrl)
    .then(()=>{
        console.log('CONNECTED');
    })
    .catch(()=>{
        console.log('FAILURE');
    });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader(
        'Access-Control-Allow-Methods',
        "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.post('/api/posts',(req,res,next)=>{
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

app.put('/api/posts/:id',(req,res,next)=>{
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

app.get('/api/posts',(req,res,next)=>{
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

app.get('/api/posts/:id',(req,res,next)=>{
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

app.delete("/api/posts/:id",(req,res,next)=>{
    Post.deleteOne({
        _id:req.params.id,
    }).then((result)=>{
        console.log(result)
    }).catch((err)=>{throw err})
    res.status(200).json({
        message:'Post deleted',
    });
});

module.exports = app;