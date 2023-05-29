import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import CreateNoteForm from "./components/CreateNoteForm";
import NotesList from "./components/NotesList";
import EditNoteForm from "./components/EditNoteForm";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:5000";

const App = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const response = await axios.get("/notes");
      setNotes(response.data);
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  }

  async function addNote(newNote) {
    try {
      const response = await axios.post("/notes", newNote);
      setNotes((prevNotes) => [...prevNotes, response.data]);
      toast.success("Note Added Successfully!");
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  }

  async function deleteNote(id) {
    if (
      window.confirm(
        "Are you sure you want to delete the note? This action is permanent."
      )
    ) {
      try {
        await axios.delete(`/notes/${id}`);
        setNotes(notes.filter((note) => note._id !== id));
        toast.success("Note deleted successfully!");
      } catch (error) {
        toast.error(error);
        console.log(error);
      }
    }
  }

  return (
    <BrowserRouter>
      <div>
        <NavBar />
        <ToastContainer
          autoClose={1000}
          hideProgressBar={true}
          newestOnTop={true}
          theme="colored"
        />
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <CreateNoteForm onAdd={addNote} fetchNotes={fetchNotes} />
                <NotesList notes={notes} onDelete={deleteNote} />
              </div>
            }
          />

          <Route
            path="/notes/edit/:noteId"
            element={<EditNoteForm fetchNotes={fetchNotes} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
