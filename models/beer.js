const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const beerSchema = new Schema({
  name: String,
  brewery: {type: Schema.Types.ObjectId, ref: "Brewery"},
  description: String,
  alchContent: String,
  price: String,
  review: [{type: Schema.Types.ObjectId}]
});

const Beer = mongoose.model("Beer", beerSchema);

module.exports = Beer;
