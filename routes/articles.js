const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;

// GET /articles 所有用户或者特定用户的文章页
// eg: GET /articles?author=xxx
router.get('/', (req, res, next) => {
    res.send('文章主页');
});

// GET /articles/:articlesId 获取特定的文章详情页
router.get('/:articlesId', (req, res, next) => {
    res.send('获取文章详情');
});

// POST /articles/create 发表一篇文章
router.post('/create', checkLogin, (req, res, next) => {
    res.send('创建文章成功！');
});

// GET /articles/create 发表文章页
router.get('/create', checkLogin, (req, res, next) => {
    res.send('创建文章页成功！');
});

// POST /articles/:articlesId/edit 更新一篇文章
router.post('/:articlesId/edit', checkLogin, (req, res, next) => {
    res.send('更新文章');
});

// GET /articles/:articlesId/edit 更新一篇文章
router.get('/:articlesId/edit', checkLogin, (req, res, next) => {
    res.send('更新文章页');
});

// GET /articles/:articleId/remove 删除一篇文章(此处可以考虑用DELETE)
router.get('/:articleId/remove', checkLogin, (req, res, next) => {
    res.send('删除文章成功！');
});

module.exports = router;