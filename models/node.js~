var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var Node = new Schema({
    _belong: { type: Schema.Types.ObjectId, ref: 'Dream' },
    content: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Node', Node);
