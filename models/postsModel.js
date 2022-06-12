const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: [true, 'user ID 未填寫']
    },
    image: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    content: {
      type: String,
      required: [true, 'Content 未填寫'],
    },
    likes: [
      { 
        type: mongoose.Schema.ObjectId, 
        ref: 'user' // id要去找user的那張表的ID
      }
    ],
    
  },
  {
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id'
});

const Posts = mongoose.model('Post', postSchema)

module.exports = Posts