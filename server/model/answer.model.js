const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  issued_On: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("Answer", answerSchema);
