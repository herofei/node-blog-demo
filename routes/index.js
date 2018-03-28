module.exports = function (app) {
    app.get('/', (req, res) => {
        res.redirect('/articles');
    });
    app.use('/signup', require('./signup'));
    app.use('/signin', require('./signin'));
    app.use('/signout', require('./signout'));
    app.use('/articles', require('./articles'));
    app.use('/comments', require('./comments'));
};