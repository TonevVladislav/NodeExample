const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    transactionHash: String,
    event: String,
    blockNumber: Number,
    data: {
      from: String,
      to: String,
      value: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
