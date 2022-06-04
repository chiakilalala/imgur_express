const express = require('express')
const jwt = require('jsonwebtoken');
const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');
const Users = require('../models/userModel');


const isAuth =handleErrorAsync(async (req,res,next)=>{
    //token is exist?
    let token;
    if ( req.headers.authorization&&  req.headers.authorization.startsWith('Bearer')){
       token =  req.headers.authorization.split(' ')[1];
       console.log(req.headers.authorization)
    } else{
      return next(appError(401, '查無 TOKEN', next))
    }

    if(!token){
      return next(appError(401, '查無 TOKEN', next))
    }
    //驗證正確性

    const decoded =await new Promise((resolve,reject)=>{
      jwt.verify(token,process.env.JWT_SECRET,(err,payload) => {
        err ?  reject(err) : resolve(payload)
      
      })
    });
    const NowUser = await Users.findById(decoded.id);
    req.user = NowUser;
    next();

});

const generateSendJWT =(user, statusCode,res)=>{

  const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_DAY
  });
  console.log(token)
  user.password =undefined;
  res.status(statusCode).json({
          status:'success',
          user:{
            token,
            id:user._id,
            name:user.name
          }
  });
};

const generateUrlJWT =(user, statusCode,res)=>{

  const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_DAY
  });
  console.log(token)
  //重新導向到前端

  res.redirect(`/callback?token=${token}&name=${user.name}`)
  //res.redirect(`heroku url/callback?token=${token}&name=${user.name}`)
  //   res.status(statusCode).send({
  //   status:true,
  //   token, 
  //   name:user.name
      
  // });

};

module.exports ={
  isAuth,
  generateSendJWT,
  generateUrlJWT
}