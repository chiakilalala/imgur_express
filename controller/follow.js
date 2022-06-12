const successhandle = require('../service/successhandle');
const handleErrorAsync = require('../service/handleErrorAsync');
const appError = require('../service/appError');
const validator = require('validator');

const Users = require('../models/userModel');


const follows = {
  postFollow:handleErrorAsync(async(req,res,next)=>{
    const followIngId = req.user.id;
    const followersId = req.params.id;
    if ( req.params.id === followIngId) {
          return next( appError(401, '您無法追蹤自己', next))
    } 
    // 調整自己的 following 追蹤者，加入 req.params.id
    await Users.updateOne(
      {
        _id:followIngId,
        'following.user':{$ne:followersId} //$ne不等於
      },
      {
        $addToSet:{followIng:{user:followersId}}
      }
    );
    //調整對方的 followers，加上自己的 id
    await Users.updateOne(
     {
       _id: followersId,
       'followers.user': { $ne: followIngId }
     },
     {
       $addToSet: { followers: { user: followIngId } }
     }
 );
 const followuser = await Users.findById({ _id: req.user.id })
 successhandle(res,'追蹤成功',followuser);
 
}),
UnFollow:handleErrorAsync(async(req,res,next)=>{
 const followIngId = req.user.id;
 const followersId = req.params.id;
 if ( req.params.id === followIngId) {
       return next( appError(401, '不可取消追蹤自己', next))
 } 
 // 調整自己的 following 追蹤者，移除 req.params.id
 await Users.updateOne(
   {
     _id:followIngId,
     'following.user':{$ne:followersId} //$ne不等於
   },
   {
     $pull:{followIng:{user:followersId}}
   }
 );
 //調整對方的 followers，移除自己的 id
 await Users.updateOne(
  {
    _id: followersId,
    'followers.user': { $ne: followIngId }
  },
  {
    $pull: { followers: { user: followIngId } }
  }
);
const unfollowuser = await Users.findById({ _id: req.user.id })
successhandle(res,'成功取消對方',unfollowuser);

}),

getFollowList:handleErrorAsync(async(req,res,next)=>{
 
  const UserId = req.user.id;
  const UserData = await Users.findById(UserId);
  const followings = UserData.following
//  let followerId = req.user._id.toString();
console.log(req)


 successhandle(res,'個人追蹤名單',followings);
})
}

module.exports = follows