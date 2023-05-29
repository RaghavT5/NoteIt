const mongoose = require("mongoose");

const noteitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Note = mongoose.model("Note", noteitSchema);

module.exports = Note;
