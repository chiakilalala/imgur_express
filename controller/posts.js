
const successhandle = require('../service/successhandle');
const handleErrorAsync = require('../service/handleErrorAsync');
const appError = require('../service/appError');
const validator = require('validator');
const Posts = require('../models/postsModel');
const Users= require('../models/userModel');


const posts ={
 // 取得個人動態牆
 getPosts:handleErrorAsync(async(req,res)=>{
// 時間排序
    const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt"
    //關鍵字搜尋
    const filter = req.query.filter !== undefined ? {"content": new RegExp(req.query.filter)} : {};
   
    const AllPost = await Posts.find(filter).populate({
          path: 'user',
          select: 'name photo'
          })
          .populate({
            path: 'comments',
            populate: {
              path: 'user',
              select: 'name photo',
            },
          }).sort(timeSort);
    successhandle(res,'資料讀取成功',AllPost)
 }),
 getOnePost:handleErrorAsync(async(req,res,next)=>{

  const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt"
  const filter = req.query.filter !== undefined ? {"content": new RegExp(req.query.filter)} : {};
  filter.user =req.params.postId;
  const AllPost = await Posts.findById(filter.user)
        .populate({
        path: 'user',
        select: 'name photo '
        }).populate({
          path: 'comments',
          populate: {
            path: 'user',
            select: 'name photo',
          },
        }).sort(timeSort);
  if(AllPost=== null){
    return appError(400, '貼文不存在', next);
  }
  successhandle(res,'資料讀取成功',AllPost)
}),
 creatPosts:handleErrorAsync(async(req,res,next)=>{
  const { body } = req;
  const { id } = req.user;
  let { content,image } =body;
  const checkUser = await Users.findById(id).exec();
  const UserId = req.user.id;

 content = content ? content.trim() : content
  console.log(req.body)
      if (!content) {
       
        return appError(400, '沒有填寫 content 資料', next);
      }
      if (!checkUser) {
       
        return appError(400, "使用者不存在", next);
      }

          const getAllPosts = await Posts.create({
          content,image,
          user:UserId
        });
   
      console.log(getAllPosts);
      successhandle(res,200,getAllPosts);

 }),
 deleteAllPost:handleErrorAsync(async(req,res,next)=>{
  await Posts.deleteMany({}).then(async () => {
    const allData = await Posts.find();
    successhandle(res,'刪除全部成功',allData);
  });
 }),
 deleteOnePost:handleErrorAsync(async(req,res,next)=>{
   const id =req.params.postId;
   const findPostId = await Posts.findById(id);
   if(findPostId == null){
     return appError(400, '文章不存在', next);  
     
   }
   const postAuthorId = findPostId.user.toString();
   if (req.user.id !== postAuthorId) {
    return next(appError(400, '此使用者沒有刪除這則貼文的權限'))
  }
  await  Posts.findByIdAndDelete(id).then(async()=>{
    const allData = await Posts.find();
    successhandle(res,'刪除成功',allData);
  })

 }),
 creatlikes:handleErrorAsync(async(req,res,next)=>{
  const _id = req.params.postId;
  const UserId = req.user.id;
  
        //是否為有效id
      if(!validator.isMongoId(_id)){
        return appError(400, '沒有這個id', next);
      }
 
      const post ={
        $addToSet: { likes: UserId }, //如果有重複的id就不會增加likes
      }
      await Posts.findOneAndUpdate({ _id: _id }, post).then(async () => {
        const allData = await Posts.find();
        successhandle(res,200 ,allData);
      });
   
 }),
 deletelike:handleErrorAsync(async(req, res, next) => {
  const _id = req.params.postId;
  const UserId = req.user.id;
    //是否為有效id
    console.log("req.user.", req.user);
  if(!validator.isMongoId(_id)){
    return appError(400, '沒有這個id', next);
  }
  const post ={
    $pull: { likes: UserId }   //如果陣列有這id就會拿掉
  }
  await Posts.findOneAndUpdate( { _id:_id}, post).then(async () => {
        const allData = await Posts.find();
        successhandle(res,'移除點贊成功' ,allData);
  });

}),



}

module.exports =posts;