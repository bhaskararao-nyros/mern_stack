var mongoose = require('mongoose');

var sports = new mongoose.Schema({
    name: { type: String },
    s_id: { type: String },
    u_id: { type: String }
    }, {
    timestamps: true
});

module.exports = mongoose.model('sports', sports);