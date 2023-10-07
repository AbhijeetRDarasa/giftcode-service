const mongoose = require("mongoose");

const GiftCodeUsed = mongoose.model(
  "giftcode_used",
  new mongoose.Schema({
    code: String,
    username: String,
    ip: String,
    created_date: { type: Date, default: Date.now() },
    amount: Number,
    brand: String,
    giftcodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "giftcode"
      }
    ]
  })
);

module.exports = GiftCodeUsed;
