var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    let info = req.flash('info')[0];
    res.render('dashboard', {info});
})

module.exports = router;