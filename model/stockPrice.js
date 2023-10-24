const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    exchange: String,
    name: String,
    quoteType: String,
    score: Number,
    exchDisp: String,
    sector: String,
    industry: String,
    symbol: String,
  });
  
  const StockPrice = mongoose.model('StockPrice', stockSchema);
  module.exports = StockPrice;