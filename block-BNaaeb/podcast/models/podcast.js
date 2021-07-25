let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let podcastSchema = new Schema({
    createdBy: String,
    name: {type: String, required: true},
    podcastUrl: String,
    podcastImg: String,
    free: String,
    vip: String,
    premium: String,
    isVerified: Boolean,
    likes: {type: Number, default: 0},
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true}
}, {timestamps: true});

module.exports = mongoose.model('Podcast', podcastSchema);