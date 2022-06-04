const appError = (httpStatus,errMsg,next)=>{
  const error = new Error(errMsg);
  console.log(errMsg)
  error.statusCode = httpStatus;
  error.isOperational = true;
  next(error);
}

module.exports = appError;