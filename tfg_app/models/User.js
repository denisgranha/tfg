var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema(
    {
        pass: String,
        email: String,
        name: String,
        isAdmin: {type: Boolean, default: false},
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        isActive: {type: Boolean, default: false}
    }
);


module.exports = mongoose.model('User', UserSchema);