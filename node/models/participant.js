var mongoose = require('mongoose');

var user = new mongoose.Schema({
    user_name: { type: String },
    email:{ type:String },
    age: { type: String },
    gender: { type: String },
    password: { type: String },
    }, {
    timestamps: true
});

module.exports = mongoose.model('user', user);