var mongoose = require('mongoose');

var joined_sports = new mongoose.Schema({
    s_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'sports' }],
    u_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
    }, {
    timestamps: true
});

module.exports = mongoose.model('joined_sports', joined_sports);