let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let commentSchema = new Schema({
    title: {type: String, requred: true},
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    articleId: {type: String, required: true},
    likes: {type: Number, default: 0}
}, {timestamps: true});

module.exports = mongoose.model("Comment", commentSchema);