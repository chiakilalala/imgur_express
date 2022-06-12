const express = require('express');
const router = express.Router();
const PostController = require('../controller/posts');
const CommentController = require('../controller/comment');



const { isAuth } = require('../service/auth');

//取得所有貼文
router.get('/posts',isAuth, PostController.getPosts);
//取得個人動態牆
router.get('/post/user/:userID',isAuth, PostController.getPosts);


//新增貼文
router.post('/posts',isAuth, PostController.creatPosts);

//取得單一貼文
router.get('/posts/:postId',isAuth, PostController.getOnePost);

//刪除所有post

router.delete('/posts',isAuth, PostController.deleteAllPost);

//刪除單一post

router.delete('/post/:postId',isAuth, PostController.deleteOnePost);

//新增點讚
router.post('/posts/:postId/like',isAuth, PostController.creatlikes);
//取消點讚
router.delete('/posts/:postId/like',isAuth, PostController.deletelike);

//新增一則留言
router.post('/posts/:id/comment',isAuth, CommentController.postComments);
//刪除一則留言
router.delete('/posts/:commentID/comment', isAuth, CommentController.deleteComments)



  

module.exports = router;




