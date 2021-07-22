let express = require('express');
let router = express.Router();
let Podcast = require('../models/podcast');


router.get('/', (req, res, next) => {
    let userType = req.user.free ? "free" : req.user.vip ? "vip" : "premium";
    res.render('clientDashboard', {userType});
});

//render podcastlist for free users
router.get('/podcastList/free', (req, res, next) => {
    Podcast.find({free: 'on', isVerified: true}, (err, podcasts) => {
        if(err) return next(err);
        res.render('freePodcastListPage', {podcasts});
    })
});

//render podcastlist for vip users
router.get('/podcastList/vip', (req, res, next) => {
    Podcast.find({vip: 'on', isVerified: true}, (err, vipPodcasts) => {
        if(err) return next(err);
        Podcast.find({free: 'on', isVerified: true}, (err, freePodcasts) => {
            if(err) return next(err);
            res.render('vipPodcastListPage', {vipPodcasts, freePodcasts});
        })
    })
});

//render podcastlist for premium users
router.get('/podcastList/premium', (req, res, next) => {
    Podcast.find({isVerified: true}, (err, allPodcasts) => {
        if(err) return next(err);
        res.render('premiumPodcastListPage', {allPodcasts});
    }) 
        
});

//render podcast create form
router.get('/podcast/new', (req, res, next) => {
    res.render('clientPodcastCreatePage');
});

//create podcast
router.post('/podcast', (req, res, next) => {
    req.body.createdBy = req.user.name + "(User)";
    req.body.free = 'on';
    req.body.isVerified = false;
    req.body.userId = req.user.id;
    console.log(req.body.userId);
    let user = req.user.free ? "free" : req.user.vip ? "vip" : "premium";
    Podcast.create(req.body, (err, podcast) => {
        if(err) return next(err);
        res.redirect('/client/podcastList/' + user);
    })
});

//View MyPodcast
router.get('/podcastList/myPodcasts', (req, res, next) => {
    let id = req.user.id;
    let userType = req.user.free ? "free" : req.user.vip ? "vip" : "premium";
    Podcast.find({userId: id, isVerified: true}, (err, podcasts) => {
        if(err) return next(err);
        res.render('clientMyPodcastList', {podcasts, userType});
    })
});

//render podcast details page
router.get('/podcast/:id', (req, res, next) => {
    let id = req.params.id;
    let userType = req.user.free ? "free" : req.user.vip ? "vip" : "premium";
    Podcast.findById(id, (err, podcast) => {
        if(err) return next(err);
        res.render('clientPodcastDetailsPage', {podcast, userType});
    })
});

//render podcast edit form
router.get('/podcast/:id/edit',(req, res, next) => {
    let id = req.params.id;
    let userType = req.user.free ? "free" : req.user.vip ? "vip" : "premium";
    Podcast.findById(id, (err, podcast) => {
        if(err) return next(err);
        res.render('clientPodcastEditForm', {podcast, userType});
    })
});

//edit podcast
router.post('/podcast/:id', (req, res, next) => {
    let id = req.params.id;
    Podcast.findByIdAndUpdate(id, req.body, (err, podcast) => {
        if(err) return next(err);
        res.redirect('/client/podcast/' + id);
    })
});

//delete podcast
router.get('/podcast/:id/delete', (req, res, next) => {
    let id = req.params.id;
    let userType = req.user.free ? "free" : req.user.vip ? "vip" : "premium";
    Podcast.findByIdAndDelete(id, (err, podcast) => {
        if(err) return next(err);
        res.redirect('/client/podcastList/' + userType)
    })
});

//increment likes
router.get('/podcast/:id/likes', (req, res, next) => {
    let id = req.params.id;
    Podcast.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, podcast) => {
        if(err) return next(err);
        res.redirect('/client/podcast/' + id);
    })
});


module.exports = router;