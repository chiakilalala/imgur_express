

const successhandle = (res,message,data,statusCode = 200)=>{
   
    res.status(200).json({
      status: "success",
      message,
      data
    })
   
    res.end();
  
}
module.exports =successhandle;