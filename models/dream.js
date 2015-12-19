var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var Dream = new Schema({
    title: String,
    description : String,
    nodes: [{type: Schema.Types.ObjectId, ref: 'Node'}],
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dream', Dream);
