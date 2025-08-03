const mongoose = require('mongoose');

const cartItemHistorySchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  voucher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher', required: true },
  quantity: { type: Number, default: 1 },
  completed_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CartItemHistory', cartItemHistorySchema);