const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const barCrawlSchema = new Schema ({
  name: String,
  invitees: { type: Schema.Types.ObjectId, ref: 'User'},
  brewery: {type: Schema.Types.ObjectId, ref: 'Brewery'},
  time: String
  date: String,
  author: {type: Schema.Types.ObjectId, ref: 'User'}
});

const BarCrawl = mongoose.model("BarCrawl", barCrawlSchema);

module.exports = BarCrawl;
