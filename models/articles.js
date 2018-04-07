const marked = require('marked');
const Article = require('../lib/mongo').Article;

// 将 article 的 content 从 markdown 转换成 html
Article.plugin('contentToHtml', {
    afterFind(articles) {
        return articles.map((article) => {
            article.content = marked(article.content);
            return article;
        });
    },
    afterFindOne(article) {
        if (article) {
            article.content = marked(article.content);
        }
        return article;
    }
});

module.exports = {
    // 创建一篇文章
    create(article) {
        return Article.create(article).exec();
    },

    // 通过文章 id 获取一篇文章
    getArticleById(articleId) {
        return Article
            .findOne({
                _id: articleId
            })
            .populate({
                path: 'author',
                model: 'User'
            })
            .addCreatedAt()
            .contentToHtml()
            .exec();
    },

    // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
    getArticles(author) {
        const query = {};
        if (author) {
            query.author = author;
        }
        return Article
            .find(query)
            .populate({
                path: 'author',
                model: 'User'
            })
            .sort({
                _id: -1
            })
            .addCreatedAt()
            .contentToHtml()
            .exec();
    },

    // 通过文章 id 获取一篇原生文章（编辑文章）
    getRawArticleById (articleId) {
        return Article
            .findOne({
                _id: articleId
            })
            .populate({
                path: 'author',
                model: 'User'
            })
            .exec();
    },

    // 通过文章 id 更新一篇文章
    updateArticleById (articleId, data) {
        return Article.update({
            _id: articleId
        }, {
            $set: data
        }).exec();
    },

    // 通过文章 id 删除一篇文章
    delArticleById (articleId) {
        return Article.deleteOne({
            _id: articleId
        }).exec();
    },

    // 通过文章 id 给 pv 加 1
    incPv(articleId) {
        return Article
            .update({
                _id: articleId
            }, {
                $inc: {
                    pv: 1
                }
            })
            .exec();
    }
};