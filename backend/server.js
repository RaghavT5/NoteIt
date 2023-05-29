const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const noteRouter = require("./routes/note");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/notes", noteRouter);

const dbUrl = "mongodb://127.0.0.1:27017/noteitDB";
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Welcome to NoteIt");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
