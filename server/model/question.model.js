const { number } = require("joi");
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  issued_On: {
    type: Date,
    default: Date.now,
  },
  likes: { type: Number, default: 0 },
  likedBy: { type: Array },
  answers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
});

module.exports = mongoose.model("Question", questionSchema);
