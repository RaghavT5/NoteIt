const express = require("express");
const mongoose = require("mongoose");

const Note = require("../models/noteitDB");

const router = express.Router();

// Get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single note
router.get("/:id", getNote, (req, res) => {
  res.json(res.note);
});

// Create a new note
router.post("/", async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
    created_at: req.body.created_at,
  });
  try {
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a note
router.patch("/:id", getNote, async (req, res) => {
  if (req.body.title != null) {
    res.note.title = req.body.title;
  }
  if (req.body.content != null) {
    res.note.content = req.body.content;
  }
  if (req.body.created_at != null) {
    res.note.created_at = req.body.created_at;
  }
  try {
    const updatedNote = await res.note.save();
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a note
router.delete("/:id", async (req, res) => {
  try {
    const result = await Note.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getNote(req, res, next) {
  let note;
  try {
    note = await Note.findById(req.params.id);
    if (note == null) {
      return res.status(404).json({ message: "Note not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.note = note;
  next();
}

module.exports = router;
