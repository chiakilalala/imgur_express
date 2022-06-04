const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const appError = require('../service/appError');
const successhandle = require('../service/successhandle');
const handleErrorAsync = require('../service/handleErrorAsync');
const { generateSendJWT } = require('../service/auth');
const Users = require('../models/userModel');
const Posts = require('../models/postsModel');
const User ={
  getUsers:handleErrorAsync(async (req,res)=>{
    
      const getUser = await Users.find();
      console.log(getUser)
      successhandle(res,'取得使用者資料',getUser);
 
  }),
  getUser:handleErrorAsync(async (req,res)=>{
    const UserId = req.user.id;
    const getOneUser = await Users.findById(UserId);
    console.log(getOneUser)
    successhandle(res,'取得個人資料',getOneUser);

  }),
 editUser:handleErrorAsync(async (req,res,next)=>{
  const UserId = req.user.id;
  if (UserId !== req.params.id) {
    return appError(401, '沒有權限', next);
  } else {
    const { name, gender, photo} =req.body;
    const id =req.params.id;
    if (!name) {
       return appError(400, '欄位資料填寫不全', next);
    } else {
      const editUser =await Users.findByIdAndUpdate(
        id,{
          name,gender,photo
        },
        { new: true,
          runValidators: true }
      );
      if (!editUser) {
        return appError(400, '編緝失敗', next);
      } else {
        // const users =await Users.find();
        successhandle(res,'更新更人資料',editUser);
        
      }
    }
  }
  


  }),
 signUp:handleErrorAsync(async(req,res,next) =>{
      let {email,password,name} =req.body;

       // 去除前後空白字元
      name = name ? name.trim() : name
      email = email ? email.trim() : email
      password = password ? password.trim() : password
      //Email 是否已被註冊過，先在資料庫尋找是否已存在 email
      const user =await Users.findOne({email});
      if(user){
        return appError(400, '帳號已被註冊！', next);
      }
      // 內容不可為空
      if(!email ||!password ||!name){
        return appError(400, '欄位不正確！', next);
      }
      // 名字要2碼以上
      if(!validator.isLength(name,{min:2})){
        return appError(400, '暱稱至少 2 個字元以上', next);
      }
       // 密碼 8 碼以上
       if (!validator.isLength(password, { min: 8 })) {
        return appError(400, '密碼需至少 8 碼以上，並中英混合', next);
    }
      //是否為email
      if(!validator.isEmail(email)){
        return appError(400, 'Email 格式不正確', next);
      }

      //密碼加密
      password =await  bcrypt.hash(password,12);

      //建立使用者
      const newUser = await Users.create({
        email,
        password,
        name
      })
    
      generateSendJWT(newUser, 200  , res);
      console.log(newUser,res)

 }),
 signIn:handleErrorAsync(async(req,res,next) =>{
    let {password, email} = req.body;

    if(!email ||!password){
      returnappError(400, '帳號密碼不可為空', next);
    }
    const user = await Users.findOne({email}).select('+password');
    const auth = await bcrypt.compare(password,user.password);
    if (!user || !auth) {
      return appError(400, '帳號或密碼錯誤，請重新輸入！', next);
    }
    console.log(user)
    generateSendJWT(user, 200, res);

 }),
 updatePassword:handleErrorAsync(async(req,res,next) =>{
  const UserId = req.user.id;
  console.log(req.params);
  if (UserId !==req.params.id ) {
    return appError(401, '你沒有權限', next);
  }
    const {password ,confirmPassword} =req.body;
    if (!validator.isLength(password,{min:8})) {
      return appError(400, '密碼需至少 8 碼以上，並中英混合', next);
    }
    if(password !== confirmPassword){
      return appError(400, '密碼不一樣', next);
    }
    newPassword = await bcrypt.hash(password, 12);
    const user = await Users.findByIdAndUpdate(UserId,{
      password:newPassword
    });
    generateSendJWT(user, 200, res);
  
 }),
 getLikeList:handleErrorAsync(async(req,res,next) =>{
  const likeList = await Posts.find({
    likes: { $in: [req.user.id] }//要找到有like欄位的id
  }).populate({
    path:"user",
    select:"name _id"
  });
  console.log(res)
  successhandle(res,'資料讀取成功',likeList);
 }),
 getPostList:handleErrorAsync(async(req,res,next) =>{

  const user = req.params.id;
  const postsList = await Posts.find({user});
  console.log(postsList)
  successhandle(res,'資料讀取成功',postsList);
 }),




};
module.exports =User;