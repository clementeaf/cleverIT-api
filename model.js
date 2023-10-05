const mongoose = require('mongoose');

const jsonSchema = new mongoose.Schema({
  key: String,
  value: Object
});

module.exports = mongoose.model('Json', jsonSchema);
