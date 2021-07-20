let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');

let userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    passwd: {type: String, required: true, minlength: 5},
    city: String
}, {timestamps: true});

userSchema.pre('save', function(next) {
    if(this.passwd && this.isModified('passwd')) {
        bcrypt.hash(this.passwd, 10, (err, hashed) => {
            if(err) return next(err);
            this.passwd = hashed;
            return next();
        })
    } else {
        next();
    }
});

userSchema.methods.verifyPasswd = function(passwd, cb) {
    bcrypt.compare(passwd, this.passwd, (err, result) => {
        return cb(err, result);
    })
}

userSchema.methods.getFullName = function(firstName, lastName) {
    if(firstName && lastName) {
        let fullName = firstName +  " " + lastName;
           return fullName;
    }
    
}
module.exports = mongoose.model("User", userSchema);