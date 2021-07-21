let express = require('express');
let router = express.Router();
let Product = require('../models/products');

let User = require('../models/users');

router.use((req, res, next) => {
    Product.distinct('categories').exec((err, categories) => {
        if(err) return next(err);
        res.locals.categories = categories;
        next();
    })
});

//render product list Page
router.get('/products', (req, res, next) => {
    console.log(req.session.cart);
    Product.find({}, (err, products) => {
        if(err) return next(err);
        res.render('clientProductsList', {products});
    })
});

//render product details page
router.get('/products/:id', (req, res, next) => {
    let id = req.params.id;
    Product.findById(id, (err, product) => {
        if(err) return next(err);
        res.render('clientProductsDetails', {product});
    })
});

//Add to cart
router.get('/products/:id/cart', (req, res, next) => {
    let id = req.params.id;
    User.findByIdAndUpdate(req.session.userId, {$push: {cart: id}}, (err, user) => {
        if(err) return next(err);
        console.log(user);
        res.redirect('/clients/products/' + id); 
    })
    
});

//render cart page
router.get('/products/cart/checkout', (req, res, next) => {
    let id = req.session.userId;
    User.findById(id).populate('cart').exec((err, user) => {
        if(err) return next(err);
        res.render('cart', {cart: user.cart});
    })
});

//remove cart item 
router.get('/products/cart/:id/delete', (req, res, next) => {
    let id = req.params.id;
    let userId = req.session.userId;
    User.findByIdAndUpdate(userId, {$pull: {cart: id}}, (err, user) => {
        if(err) return next(err);
        res.redirect('/clients/products/cart/checkout');
    })
});

router.get('/products/category/:cat', (req, res, next) => {
    let cat = req.params.cat;
    Product.find({categories: cat}, (err, products) => {
        if(err) return next(err);
        res.render('clientProductsList', {products});
    }) 
});

module.exports = router;