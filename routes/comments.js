const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;

// POST /comments/create 发表评论
router.post('/create', checkLogin, (req, res, next) => {
    res.send('发表评论');
});

// GET /comments/:commentId/remove 删除评论(此处可以考虑用DELETE)
router.get('/:commentId/remove', checkLogin, (req, res, next) => {
    res.send('删除评论');
});

module.exports = router;