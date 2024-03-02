const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
require('mongoose-type-url')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: "Username is a mandatory attribute",
        unique: true
    },
    name: {
        type: String,
        required: "Name is a mandatory attribute"
    },
    password: {
        type: String,
        required: "Password is a required attribute",
    },
    email: {
        type: String,
        required: "Email is a mandatory attribute",
        unique: true
    },
    bio: {
        type: String,
    },
    location: {
        type: String,
    },
    links: {
        type: mongoose.SchemaTypes.Url,
        message: "Incorrect URL"
    },
    avatarUrl: {
        type: mongoose.SchemaTypes.Url,
        message: "Incorrect URL"
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, {
    timestamps: true
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {

    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch)
    })
}

module.exports = mongoose.model("User", UserSchema);