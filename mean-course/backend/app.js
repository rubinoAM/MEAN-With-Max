const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoUrl = require('./config');
const postsRoutes = require('./routes/posts');

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

app.use(postsRoutes);

module.exports = app;