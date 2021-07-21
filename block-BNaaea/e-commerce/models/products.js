let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let productSchema = new Schema({
    name: {type: String, required: true},
    quantity: {type: Number, default: 0},
    likes: {type: Number, default: 0},
    price: Number,
     img: String,
     categories: [String]
}, {timestamps: true});

module.exports = mongoose.model("Product", productSchema);
