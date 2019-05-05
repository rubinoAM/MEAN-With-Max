const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post('/signup',(req,res,next)=>{
    bcrypt.hash(req.body.password,10)
        .then(hash => {
            const user = new User({
                email:req.body.email,
                password:hash,
            })
            user.save()
                .then(result => {
                    res.status(201).json({
                        message:'User created',
                        result:result,
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error:err
                    })
                });
        })
})

router.post('/login',(req,res,next)=>{
    User.findOne({email:req.body.email})
        .then(user =>{
            if(!user){
                return res.status(401).json({
                    message:'Login failed',
                });
            }
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result =>{
            if(!result){
                return res.status(401).json({
                    message:'Login failed',
                });
            }
            const token = jwt.sign(
                {
                    email:user.email,
                    userId:user._id
                },
                'hash_secret_166552afbf222226e68edea13ce6121a',
                {expiresIn: '1h'}
            );
            res.status(200).json({
                message:'Login sucessful',
                token:token,
            })
        })
        .catch((err)=> {
            res.status(500).json({
                error:err
            })
        });
});

module.exports = router;