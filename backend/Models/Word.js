const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let wordSchema = new Schema({
  word: {
    type: String
  }
}, {
    collection: 'words'
  })

module.exports = mongoose.model('Word', wordSchema)