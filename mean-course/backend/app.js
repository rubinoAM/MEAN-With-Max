const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader(
        'Access-Control-Allow-Methods',
        "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.post('/api/posts',(req,res,next)=>{
    const post = new Post({
        title:req.body.title,
        content:req.body.content,
    });
    // console.log(post);
    res.status(201).json({
        message: 'Post added',
    });
});

app.get('/api/posts',(req,res,next)=>{
    const posts = [
        {
            id:'f48ha9sf',
            title:'First server-side post', 
            content:'WOMPBOMPALOOBOMPALOPBAMPBOOP'
        },
        {
            id:'f8392haf',
            title:'Second server-side post', 
            content:'WOMPBOMPALOOBOMPALOPBAMPBOOP'
        },
    ];
    res.status(200).json({
        message:'Posts fetched successfully',
        posts:posts,
    });
});

module.exports = app;