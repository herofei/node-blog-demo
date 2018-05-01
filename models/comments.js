const marked = require('marked');
const Comment = require('../lib/mongo').Comment;

// 将 comment 的 content 从 markdown 转换成 html
Comment.plugin('contentToHtml', {
    afterFind (comments) {
        return comments.map((comment) => {
            comment.content = marked(comment.content);
            return comment;
        });
    }
});

module.exports = {
    // 创建一个留言
    create (comment) {
        return Comment.create(comment).exec();
    },

    // 通过留言 id 获取一个留言
    getCommentById (commentId) {
        return Comment.findOne({
            _id: commentId
        }).exec();
    },

    // 通过留言 id 删除一个留言
    delCommentById (commentId) {
        return Comment.deleteOne({
            _id: commentId
        }).exec();
    },

    // 通过文章 id 删除该文章下所有留言
    delCommentsByArticleId (articleId) {
        return Comment.deleteMany({
            articleId: articleId
        }).exec();
    },

    // 通过文章 id 获取该文章下所有留言，按留言创建时间升序
    getComments (articleId) {
        return Comment
            .find({
                articleId: articleId
            })
            .populate({
                path: 'author',
                model: 'User'
            })
            .sort({
                _id: 1
            })
            .addCreatedAt()
            .contentToHtml()
            .exec();
    },

    // 通过文章 id 获取该文章下留言数
    getCommentsCount (articleId) {
        return Comment.count({
            articleId: articleId
        }).exec();
    }
};