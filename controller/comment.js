const successhandle = require('../service/successhandle');
const handleErrorAsync = require('../service/handleErrorAsync');
const appError = require('../service/appError');
const validator = require('validator');
const Posts = require('../models/postsModel');
const Comment = require('../models/commentModel');


const comments ={
  postComments:handleErrorAsync(async(req, res, next) => {
    const user = req.user.id;
    const post = req.params.id;
    const { comment } = req.body;
    if(!comment){
      return next(appError(400, '不得為空！', next));
    }
    const newComment = await Comment.create({
      post,
      user,
      comment
  });
  successhandle(res, 200,newComment);
}),
deleteComments:handleErrorAsync(async(req, res, next) => {
 
  const { commentID } = req.params;
  if(!validator.isMongoId(commentID)){
    return appError(400, '沒有這個id', next);
  }
  const comment = await Comment.findById(commentID);
  if (!comment) return next(appError(400, '查無此留言，無法刪除', next));
  if (req.user.id === comment.user._id.toString()) {
    let delComment = await Comment.findByIdAndDelete(commentID)
    successhandle(res,'刪除留言成功',delComment)
  } else {
    return next(appError(400,'您不非留言者，無法刪除此留言', next))
  }

}),

}

module.exports = comments;