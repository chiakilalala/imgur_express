

   
const errorhandle = {
  resErrProd(err,res){
    console.log(err)
    if (err.isOperational) {
      //錯誤狀態碼
       res.status(err.statusCode).json({
         //錯誤詳細訊息
         message:err.message
       })
    } else {
      //log 紀錄
      console.error('出現重大錯誤', err);
      // 送出罐頭預設訊息
      res.status(500).json({
        status:'error',
        message:'系統錯誤，請恰系統管理員'
      })
      
    }
  },
  // 開發環境錯誤
  resErrDev(err,res){
     //錯誤狀態碼
     res.status(err.statusCode).json({
      //錯誤詳細訊息
      message:err.message,
      error:err,
      statck:err.stack
    })
  }
}
module.exports = errorhandle;