let express = require('express');
let router = express.Router();
let Podcast = require('../models/podcast');
let multer = require('multer');
let path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    }
  });
   
  var upload = multer({ storage: storage });

//render client dashboard page
router.get('/', (req, res, next) => {
    res.render('adminDashboard');
});

//render podcast create form
router.get('/podcast/new', (req, res, next) => {
    res.render('podcastCreateForm');
});

//create podcast
router.post('/podcast', upload.fields([{name: 'podcastUrl', maxCount: 1}, { name: 'podcastImg', maxCount: 1}]), (req, res, next) => {
    req.body.isVerified = true;
    req.body.createdBy = "Admin";
    req.body.userId = req.user.id;
    req.body.podcastUrl = req.files.podcastUrl && req.files.podcastUrl[0].filename;
    req.body.podcastImg = req.files.podcastImg && req.files.podcastImg[0].filename;
    Podcast.create(req.body, (err, podcast) => {
        if(err) return next(err);
        res.redirect('/admin/podcastList');
    })
});

//list all podcasts
router.get('/podcastList', (req, res, next) => {
    Podcast.find({isVerified: true}, (err, podcasts) => {
        if(err) return next(err);
        res.render('adminPodcastListPage', {podcasts});
    })
});

//render podcast verification page
router.get('/podcastList/verification', (req, res, next) => {
    Podcast.find({isVerified: false}, (err, podcasts) => {
        if(err) return next(err);
        res.render('podcastVerificationPage', {podcasts});
    })
});

//verify a podcast
router.get('/podcast/:id/verify', (req, res, next) => {
    let id = req.params.id;
    Podcast.findById(id, (err, podcast) => {
        if(err) return next(err);
        req.body.isVerified = true;
        Podcast.findByIdAndUpdate(id, req.body, (err, podcast) => {
            if(err) return next(err);
            res.redirect('/admin/podcastList');
        })
    })
});

//Display a specific podcast
router.get('/podcast/:id', (req, res, next) => {
    let id = req.params.id;
    Podcast.findById(id, (err, podcast) => {
        if(err) return next(err);
        res.render('adminPodcastDetailsPage', {podcast});
    })
});

//render podcast edit form
router.get('/podcast/:id/edit', (req, res, next) => {
    let id = req.params.id;
    Podcast.findById(id, (err, podcast) => {
        if(err) return next(err);
        res.render('adminPodcastEditPage', {podcast});
    })
});

//edit podcast
router.post('/podcast/:id', upload.fields([{name: 'podcastUrl', maxCount: 1}, {name: 'podcastImg', maxCount: 1}]), (req, res, next) => {
    let id = req.params.id;
    console.log(req);
    req.body.podcastUrl = req.files.podcastUrl && req.files.podcastUrl[0].filename;
    req.body.podcastImg = req.files.podcastImg && req.files.podcastImg[0].filename;
    Podcast.findByIdAndUpdate(id, req.body, (err, podcast) => {
        if(err) return next(err);
        console.log(podcast);
        res.redirect('/admin/podcast/' + id);
    })
});

//delete podcast 
router.get('/podcast/:id/delete', (req, res, next) => {
    let id = req.params.id;
    Podcast.findByIdAndDelete(id, (err, podcast) => {
        if(err) return next(err);
        res.redirect('/admin/podcastList');
    }) 
});

//increment likes
router.get('/podcast/:id/likes', (req, res, next) => {
    let id = req.params.id;
    Podcast.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, podcast) => {
        if(err) return next(err);
        res.redirect('/admin/podcast/' + id);
    })
});

//render mypodast list
router.get('/podcastList/myPodcasts', (req, res, next) => {
    let id = req.user.id;
    let userType = req.user.free ? "free" : req.user.vip ? "vip" : "premium";
    Podcast.find({userId: id, isVerified: true}, (err, podcasts) => {
        if(err) return next(err);
        res.render('clientMyPodcastList', {podcasts, userType});
    })
});
module.exports = router;