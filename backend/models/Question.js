const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    options: {
      type: [String],
      required: true,
    },

    correctAnswer: {
      type: Number,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    important: {
      type: Boolean,
      default: false,
    },

    repeated: {
      type: Boolean,
      default: false,
    },

    repeatedYears: {
      type: [Number],
      default: [],
    },

    frequency: {
      type: Number,
      default: 0,
    },

    solved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);