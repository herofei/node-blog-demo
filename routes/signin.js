const express = require('express');
const router = express.Router();
const checkNotLogin  = require('../middlewares/check').checkNotLogin;

// GET /signin 获取登录页
router.get('/', checkNotLogin , (req, res, next) => {
    res.send('获取登录页');
});

// POST /signin 登录
router.post('/', checkNotLogin , (req, res, next) => {
    res.send('登录成功');
});

module.exports = router;