const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config');
const postsRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');

const app = express();
mongoose.connect(config.mongoUrl)
    .then(()=>{
        console.log('CONNECTED');
    })
    .catch(()=>{
        console.log('FAILURE');
    });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader(
        'Access-Control-Allow-Methods',
        "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;