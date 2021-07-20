let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

let articleSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    likes: {type: Number, default: 0},
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    tags: [String],
    slug: {type: String, slug: "title", unique: true},
    author: {type: Schema.Types.ObjectId, ref: "User", required: true}
}, {timestamps: true})

articleSchema.pre('save', function(next) {
    this.slug = this.title.split(" ").join("-");
    next();
});

module.exports = mongoose.model("Article", articleSchema);