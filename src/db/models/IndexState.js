const mongoose = require("mongoose");

const indexStateSchema = new mongoose.Schema({
  contractAddress: { type: String, unique: true },
  lastIndexedBlock: Number,
});

module.exports = mongoose.model("IndexState", indexStateSchema);
