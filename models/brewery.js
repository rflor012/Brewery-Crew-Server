const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const brewerySchema = new Schema({
  name: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  phone: String,
  site: String,
  beers: [{type: Schema.Types.ObjectId, ref: 'Beer'}],

  promotion: {type: Schema.Types.ObjectId},
  hours: String,
  // coverCharge: String

});


const Brewery = mongoose.model('Brewery', brewerySchema)



module.exports = Brewery;
