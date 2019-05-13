const Post = require('../models/post');

exports.createPost = (req,res,next)=>{
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
}

exports.updatePost = (req,res,next)=>{
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
            if(result.n > 0){
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
}

exports.deletePost = (req,res,next)=>{
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
}

exports.getAllPosts = (req,res,next)=>{
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
}

exports.getSinglePost = (req,res,next)=>{
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
}