const mongoose = require('mongoose');
const dotenv =require('dotenv');

dotenv.config({path:'./config.env'});

//資料庫連接

let DB ='';   
if (process.env.NODE_ENV === 'dev') {
     
     // DB = process.env.DATABASE
     DB = process.env.DATABASE.replace('<password>', process.env.DATABASEPASSWORD)
   } else {
    
     DB = process.env.DATABASE.replace('<password>', process.env.DATABASEPASSWORD)
   }

mongoose
.connect(DB)
.then(() => console.log('資料庫連接成功'))
.catch((err)=>{
     console.log(err);
});