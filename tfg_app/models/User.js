var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    pass: String,
    email: String
});

module.exports = mongoose.model('User', UserSchema);