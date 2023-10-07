const mongoose = require("mongoose");

const GiftCode = mongoose.model(
  "giftcode",
  new mongoose.Schema({
    code : String,
    name : String,
    times : Number,
    aff_id: String,
    times_on_user : Number,
    type: Number,
    amount: Number,
    is_validate_ip: Boolean,
    brand: String,
    rolling: { type: Number, default: 0 },
    expired_at: { type: Date, default: Date.now()},
    created_time: { type: Date, default: Date.now() },
    is_active:Boolean,
    giftcode_usages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "giftcode_used"
      }
    ]
  })
);

module.exports = GiftCode;
