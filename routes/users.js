
var express = require('express');
var router = express.Router();
const usersController = require('../controller/users');
const followsController = require('../controller/follow');
const { isAuth, generateUrlJWT, generateSendJWT } = require('../service/auth');
const passport = require('passport');



/*註冊 */
router.post('/sign_up', usersController.signUp);
/*登入 */
router.post('/sign_in', usersController.signIn);
/*取得所有使用者 */
router.get('/allusers',isAuth,usersController.getUsers);
/*看個人資料 */
router.get('/profile',isAuth,usersController.getUser);
/*更新個人資料 */
router.patch('/profile/:id',isAuth,usersController.editUser);
/*重設密碼 */
router.post('/updatePassword/:id',
isAuth,
usersController.updatePassword);  
//取得所有點讚貼文
router.get('/getLikeList',isAuth, usersController.getLikeList);

//取得個人貼文列表
router.get('/:id',isAuth, usersController.getPostList);

//追蹤朋友
router.post('/:id/follow',isAuth, followsController.postFollow);

//取消追蹤朋友
router.delete('/:id/unfollow',isAuth, followsController.UnFollow);

// 取得個人追蹤名單
router.get('/following',isAuth, followsController.getFollowList);

router.get('/google', passport.authenticate('google', {
  scope: [ 'email', 'profile' ],
}));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  generateUrlJWT(req.user, res);
  console.log(res)
})
 


module.exports = router;