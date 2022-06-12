const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, '請輸入您的名字']
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true,
      select: false
    },
    photo: String,
    sex:{
      type: String,
      enum:["male","female"]
    },
    password:{
      type: String,
      required: [true,'請輸入密碼'],
      minlength: 8,
      select: false
    },
    googleId:{
      type:String,
      default: '',
    },
    followers: [
      {
        user: { 
          type: mongoose.Schema.ObjectId, 
          ref: 'user' },
        createdAt: {
          type: Date,
          default: Date.now
        },
        select: false
    }
    ],
    following: [
    {
      user: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'user' },
      createdAt: {
        type: Date,
        default: Date.now
      },
      select: false
    }
    ],
  
  },{
    versionKey: false,
  }
  );
 
  // 若有find 則同時觸發此功能
userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "following",
    populate: {
      path: "user",
      model: "user",
      select: "name UserId",
    },
  });

  next();
});
// User
const User = mongoose.model('user', userSchema);

module.exports = User;