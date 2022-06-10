const express = require('express');
const router = express.Router();
const PostController = require('../controller/posts');
const CommentController = require('../controller/comment');



const { isAuth } = require('../service/auth');
//取得個人動態牆
router.get('/post/user/:userID',isAuth, PostController.getPosts);
//取得單一貼文
router.get('/posts/:id',isAuth, PostController.getOnePost);

//新增貼文
router.post('/posts',isAuth, PostController.creatPosts);
//新增點讚
router.post('/posts/:id/like',isAuth, PostController.creatlikes);
//取消點讚
router.delete('/posts/:id/like',isAuth, PostController.deletelike);

//新增一則留言
router.post('/posts/:id/comment',isAuth, CommentController.postComments);
//刪除一則留言
router.delete('/posts/:commentID/comment', isAuth, CommentController.deleteComments)



  

module.exports = router;




