let express = require('express');
let router = express.Router();
let Comment = require('../models/comments');
let Article = require('../models/articles');
let auth = require('../middlewares/auth');

router.use(auth.loggedInUser);

//get comment edit form
router.get('/:id/edit', (req, res, next) => {
    let id = req.params.id;
    Comment.findById(id, (err, comment) => {
        if(err) return next(err);
        if(comment.author == req.user.id) {
            res.render('updateCommentForm', {comment});
        } else {
            req.flash('info', 'Not Authorised to Perform this Action');
            res.redirect('/articles/' + comment.articleId);
        }
        
    })

});

//update comment
router.post('/:id', (req, res, next) => {
    let id = req.params.id;
    Comment.findByIdAndUpdate(id, req.body, (err, comment) => {
        if(err) return next(err);
        res.redirect('/articles/' + comment.articleId);
    })
});

//delete comments
router.get('/:id/delete', (req, res, next) => {
    let id = req.params.id;
    Comment.findById(id, (err, comment) => {
        if(err) return next(err);
        if(comment.author == req.user.id) {
            Comment.findByIdAndDelete(id, (err, comment) => {
                if(err) return next(err);
                Article.findOneAndUpdate({slug: comment.articleId}, {$pull: {comments: comment.id}}, (err, article) => {
                    if(err) return next(err);
                    res.redirect('/articles/' + article.slug);
                })
            })
        } else {
            req.flash('info', 'Not Authorised to Perform this Action');
            res.redirect('/articles/' + comment.articleId);
        }
    })
    
})

//like comments
router.get('/:id/likes', (req, res, next) => {
    let id = req.params.id;
    Comment.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, comment) => {
        if(err) return next(err);
        res.redirect('/articles/' + comment.articleId);
    })
});

module.exports = router;