const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },

    correct: {
      type: Number,
      required: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    percentage: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Result", resultSchema);