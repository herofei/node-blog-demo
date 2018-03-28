const express = require('express');
const router = express.Router();
const checkNotLogin  = require('../middlewares/check').checkNotLogin;

// GET /signup 获取注册页
router.get('/', checkNotLogin , (req, res, next) => {
    res.send('获取注册页');
});

// POST /signup 注册
router.post('/', checkNotLogin , (req, res, next) => {
    res.send('注册成功');
});

module.exports = router;