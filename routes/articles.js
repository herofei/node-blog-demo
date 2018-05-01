const express = require('express');
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;
const ArticleModel = require('../models/articles');
const CommentModel = require('../models/comments');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

// GET /articles 所有用户或者特定用户的文章页
// eg: GET /articles?author=xxx
router.get('/', (req, res, next) => {
    const author = req.query.author;
    ArticleModel.getArticles(author)
        .then((articles) => {
            res.render('articles', {
                articles: articles
            });
        })
        .catch(next);
});

// GET /articles/create 发表文章页
router.get('/create', checkLogin, (req, res, next) => {
    res.render('create');
});

// POST /articles/create 发表一篇文章
router.post('/create', multipartMiddleware, checkLogin, (req, res, next) => {
    debugger;
    const author = req.session.user._id;
    const title = req.body.title;
    const content = req.body.content;

    // 校验参数
    try {
        if (!title.length) {
            throw new Error('请填写标题');
        }
        if (!content.length) {
            throw new Error('请填写内容');
        }
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('back');
    }

    let article = {
        author: author,
        title: title,
        content: content
    };

    ArticleModel.create(article)
        .then((result) => {
            // 此 article 是插入 mongodb 后的值，包含 _id
            article = result.ops[0];
            req.flash('success', '发表成功');
            // 发表成功后跳转到该文章页
            res.redirect(`/articles/${article._id}`);
        })
        .catch(next);
});

// GET /articles/:articleId 获取特定的文章详情页
router.get('/:articleId', (req, res, next) => {
    const articleId = req.params.articleId;

    Promise.all([
            ArticleModel.getArticleById(articleId), // 获取文章信息
            CommentModel.getComments(articleId), // 获取该文章所有留言
            ArticleModel.incPv(articleId) // pv 加 1
        ])
        .then((result) => {
            const article = result[0];
            const comments = result[1];
            if (!article) {
                throw new Error('该文章不存在');
            }

            res.render('article', {
                article: article,
                comments: comments
            });
        })
        .catch(next);
});

// GET /articles/:articleId/edit 获取某篇文章编辑页面
router.get('/:articleId/edit', checkLogin, (req, res, next) => {
    const articleId = req.params.articleId;
    const author = req.session.user._id;

    ArticleModel.getRawArticleById(articleId)
        .then((article) => {
            if (!article) {
                throw new Error('该文章不存在');
            }
            if (author.toString() !== article.author._id.toString()) {
                throw new Error('权限不足');
            }
            res.render('edit', {
                article: article
            });
        })
        .catch(next);
});

// POST /articles/:articleId/edit 更新一篇文章
router.post('/:articleId/edit', checkLogin, (req, res, next) => {
    const articleId = req.params.articleId;
    const author = req.session.user._id;
    const title = req.fields.title;
    const content = req.fields.content;

    // 校验参数
    try {
        if (!title.length) {
            throw new Error('请填写标题');
        }
        if (!content.length) {
            throw new Error('请填写内容');
        }
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('back');
    }

    ArticleModel.getRawArticleById(articleId)
        .then((article) => {
            if (!article) {
                throw new Error('文章不存在');
            }
            if (article.author._id.toString() !== author.toString()) {
                throw new Error('没有权限');
            }
            ArticleModel.updateArticleById(articleId, {
                    title: title,
                    content: content
                })
                .then(() => {
                    req.flash('success', '编辑文章成功');
                    // 编辑成功后跳转到上一页
                    res.redirect(`/articles/${articleId}`);
                })
                .catch(next);
        });
});

// GET /articles/:articleId/remove 删除一篇文章(此处可以考虑用DELETE)
router.get('/:articleId/remove', checkLogin, (req, res, next) => {
    const articleId = req.params.articleId;
    const author = req.session.user._id;

    ArticleModel.getRawArticleById(articleId)
        .then((article) => {
            if (!article) {
                throw new Error('文章不存在');
            }
            if (article.author._id.toString() !== author.toString()) {
                throw new Error('没有权限');
            }
            ArticleModel.delArticleById(articleId)
                .then(() => {
                    req.flash('success', '删除文章成功');
                    // 删除成功后跳转到主页
                    res.redirect('/articles');
                })
                .catch(next);
        });
});

module.exports = router;