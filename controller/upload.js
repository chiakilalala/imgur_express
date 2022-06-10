


const appError = require('../service/appError');
const successhandle = require('../service/successhandle');
const handleErrorAsync = require('../service/handleErrorAsync');
const { generateSendJWT } = require('../service/auth');
const sizeOf = require('image-size');
const upload = require('../service/image');
const { ImgurClient } = require('imgur');

const  Upload = {
  uploadfile:handleErrorAsync(async (req,res,next)=>{
// 若上傳檔案不符或沒有成功上傳，回傳錯誤訊息
    if(!req.files.length) {
      return appError(400, '尚未上傳檔案', next);
    }
      // 檢測圖片尺寸
    const dimensions = sizeOf(req.files[0].buffer);
    if(dimensions.width !== dimensions.height) {
      
        return appError(400, '圖片長寬不符合 1:1 尺寸', next);
    }
    // 加入申請好的 imgur client 資訊
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENT_ID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_CLIENT_REFRESH_TOKEN,
    });
    /// 將 buffer 編碼為 base64 格式並上傳至指定好的 imgur 相簿
    const response = await client.upload({
      image: req.files[0].buffer.toString('base64'),
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID
    });
    console.log(response)
    successhandle(res, '資料讀取成功', { url: response.data.link });


}),
}

module.exports =Upload;