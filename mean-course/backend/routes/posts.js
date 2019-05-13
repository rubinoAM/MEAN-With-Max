const express = require('express');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/extract-file');
const postController = require('../controllers/posts');

const router = express.Router();

router.post(
    '',
    checkAuth,
    extractFile,
    postController.createPost
);
router.get(
    '',
    postController.getAllPosts
);
router.get(
    '/:id',
    postController.getSinglePost
);
router.put(
    '/:id',
    checkAuth,
    extractFile,
    postController.updatePost
);
router.delete(
    "/:id",
    checkAuth,
    postController.deletePost
);

module.exports = router;