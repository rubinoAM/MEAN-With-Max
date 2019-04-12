const express = require('express');
const app = express();

app.use('/api/posts',(req,res,next)=>{
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