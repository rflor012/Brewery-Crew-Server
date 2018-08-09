const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const USERROLES = ["admin", "brewery", "user"];

const userSchema = new Schema({
  email: String,
  password: String,
  username: String,
  reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}],
  // userImage: String,
  // barCrawlLoc:[{type: Schema.Types.ObjectId}]
  myBrewery:{type: Schema.Types.ObjectId, ref: 'Brewery'},
  role: {type:String, enum: USERROLES },

},{timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;
