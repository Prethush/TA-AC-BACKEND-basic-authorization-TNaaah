let express = require('express');
let User = require('../models/users');
let router = express.Router();
let Product = require('../models/products');

router.use((req, res, next) => {
    Product.distinct('categories').exec((err, categories) => {
        if(err) return next(err);
        res.locals.categories = categories;
        next();
    })
});
//render all the product 
router.get('/products', (req, res, next) => {
    Product.find({}, (err, products) => {
        if(err) return next(err);
        res.render('adminProductList', {products});
    })
});

//render product create page
router.get('/products/new', (req, res, next) => {
    res.render('productCreateForm');
});

//creating products
router.post('/products', (req, res, next) => {
    req.body.categories = req.body.categories.trim().split(" ");
    Product.create(req.body, (err, product) => {
        if(err) return next(err);
        console.log(product);
        res.redirect('/admin/products');
    })
});

//render product details page
router.get('/products/:id', (req, res, next) => {
    let id = req.params.id;
    Product.findById(id, (err, product) => {
        if(err) return next(err);
        res.render('adminProductDetails', {product});
    })
});
 
//render product edit form
router.get('/products/:id/edit', (req, res, next) => {
    let id = req.params.id;
    Product.findById(id, (err, product) => {
        if(err) return next(err);
        product.categories = product.categories.join(" ");
        res.render("productEditForm", {product});
    })
});

//edit products
router.post('/products/:id', (req, res, next) => {
    let id = req.params.id;
    req.body.categories = req.body.categories.trim().split(" ");
    Product.findByIdAndUpdate(id, req.body, (err, product) => {
        if(err) return next(err);
        res.redirect('/admin/products/' + id);
    })
});

//delete products
router.get('/products/:id/delete', (req, res, next) => {
    let id = req.params.id;
    Product.findByIdAndDelete(id, (err, product) => {
        if(err) return next(err);
        res.redirect('/admin/products');
    })
});

//increment likes
router.get('/products/:id/likes', (req, res, next) => {
    let id = req.params.id;
    Product.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, product) => {
        if(err) return next(err);
        res.redirect('/admin/products/' + id);
    })
});

//sort based on category
router.get('/products/category/:cat', (req, res, next) => {
    let cat = req.params.cat;
    Product.find({categories: cat}, (err, products) => {
        if(err) return next(err);
        res.render('adminProductList', {products});
    }) 
});

router.get('/userslist', (req, res, next) => {
    let message = req.flash('message')[0];
    User.find({user: 'on'}, (err, users) => {
        if(err) return next(err);
        res.render('usersList', {users, message});
    })
});

//block a user
router.get('/block/:id', (req, res, next) => {
    let id = req.params.id;
    req.body.blocked = true;
    User.findByIdAndUpdate(id, req.body, (err, user) => {
        if(err) return next(err);
        req.flash("message", "Successfully Blocked");
        res.redirect('/admin/userslist');
    })
});

//unblock a user 
router.get('/unblock/:id', (req, res, next) => {
    let id = req.params.id;
    req.body.blocked = false;
    User.findByIdAndUpdate(id, req.body, (err, user) => {
        if(err) return next(err);
        req.flash("message", "Successfully Unblocked");
        res.redirect('/admin/userslist');
    })
})

module.exports = router;