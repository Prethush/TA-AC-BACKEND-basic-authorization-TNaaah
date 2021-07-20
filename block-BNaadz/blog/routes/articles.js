let express = require('express');
let router = express.Router();
let Article = require('../models/articles');
let Comment = require('../models/comments');
let auth = require('../middlewares/auth');
let User = require('../models/users');


//display entire article
router.get('/', (req, res, next) => {
    Article.find({}, (err, articles) => {
        if(err) return next(err);
        res.render("articleList", {articles})
    })
   
});

//render article create form
router.get('/new', auth.loggedInUser, (req, res, next) => {
    res.render('articleCreateForm');
});

//display a specific article
router.get("/:slug", (req, res, next) => {
    let slug = req.params.slug;
    let error = req.flash('error')[0];
    let info = req.flash('info')[0];
    Article.findOne({slug}).populate('comments').populate('author', 'firstName email').exec((err, article) => {
        if(err) return next(err);
        Comment.find({articleId: slug}).populate('author', 'firstName email').exec((err, comments) => {
            if(err) return next(err);
            console.log(comments);
            res.render('articleDetails', {article, error, comments, info});
        });
    })
});

router.use(auth.loggedInUser);



//create article
router.post('/', (req, res, next) => {
    req.body.tags = req.body.tags.trim().split(" ");
    req.body.author = req.user.id;
        Article.create(req.body, (err, article) => {
        if(err) return next(err);
        console.log(article);
        res.redirect('/articles');
    })
    
});

//render article edit form
router.get("/:slug/edit", (req, res, next) => {
    let slug = req.params.slug;
    Article.findOne({slug}, (err, article) => {
        if(err) return next(err);
        console.log(article.author, req.user.id);
        if(article.author == req.user.id) {
            article.tags = article.tags.join(" ");
            res.render('articleUpdateForm', {article});
        } else {
            req.flash("error", "Not Authorised to Perform this Action");
            res.redirect('/articles/' + slug);
        }
       
    })
});

//edit article
router.post('/:slug', (req, res, next) => {
    let slug = req.params.slug;
    req.body.tags = req.body.tags.trim().split(" ");
    Article.findOneAndUpdate({slug}, req.body, (err, article) => {
        if(err) return next(err);
        res.redirect('/articles/' + slug);
    })
});

//delete article
router.get('/:slug/delete', (req, res, next) => {
    let slug = req.params.slug;
    Article.findOne({slug}, (err, article) => {
        if(err) return next(err);
        if(article.author == req.user.id) {
            Article.findOneAndDelete({slug}, (err, article) => {
                if(err) return next(err);
                Comment.deleteMany({articleId: slug}, (err, comments) => {
                    if(err) return next(err);
                    console.log(comments);
                    res.redirect('/articles');
                })
               
            })
        } else {
            req.flash('error', 'Not Authorised to Perform this Action');
            res.redirect('/articles/' + slug);
        }
    })
    
});

//increment like
router.get('/:slug/like', (req, res, next) => {
    let slug = req.params.slug;
    Article.findOneAndUpdate({slug}, {$inc: {likes: 1}}, (err, article) => {
        if(err) return next(err);
        res.redirect('/articles/' + slug);
    })
});

//creating comment
router.post('/:slug/comments', (req, res, next) => {
    let slug = req.params.slug;
    Article.findOne({slug}, (err, article) => {
        if(err) return next(err);
      req.body.articleId = slug;
      req.body.author = req.user.id;
      Comment.create(req.body, (err, comment) => {
          if(err) return next(err);
          console.log(comment);
          Article.findOneAndUpdate({slug}, {$push: {comments: comment.id}}, (err, article) => {
              if(err) return next(err);
              res.redirect('/articles/' + slug);
          })
      })
    })
  
  });

  //display myarticles page
  router.get('/list/:id', (req, res, next) => {
      let id = req.params.id;
      Article.find({author : id}, (err, articles) => {
        if(err) return next(err);
        res.render('myArticles', {articles});
      })
  });

module.exports = router;