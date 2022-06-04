const express = require('express');
const router = express.Router();

const { isAuth } = require('../service/auth');
const uploadController = require('../controller/upload');
const upload = require('../service/image');

router.post('/api/v1/upload',isAuth,upload,uploadController.uploadfile);

module.exports = router;

