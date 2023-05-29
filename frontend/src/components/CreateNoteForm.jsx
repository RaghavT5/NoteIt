import React, { useState } from "react";
import { HiPlus } from "react-icons/hi";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";

axios.defaults.baseURL = "http://localhost:5000";

function CreateNoteForm(props) {
  const [isExpanded, setExpanded] = useState(false);

  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  async function submitNote(event) {
    event.preventDefault();

    if (!note.title || !note.content) {
      toast.error("All fields are mandatory!");
      return;
    }

    try {
      const response = await axios.post("/notes", note);
      setNote({
        title: "",
        content: "",
      });
      toast.success("Note Added Successfully!");
      props.fetchNotes();
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  }

  function expand() {
    setExpanded(true);
  }

  return (
    <div className="mt-32 flex justify-center items-center">
      <form className="w-[720px] mx-8 my-5 px-4 rounded-lg shadow-lg shadow-gray-300 items-center justify-center place-items-center">
        {isExpanded ? (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
            required
            className="w-full p-2 text-2xl text-semibold outline-none"
          />
        ) : null}

        <TextareaAutosize
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          minRows={1}
          maxRows={15}
          required
          className="w-full p-2 text-2xl outline-none resize-none"
        />

        {isExpanded && (
          <button
            onClick={submitNote}
            className="bg-yellow-400 rounded-full p-2 text-white float-right mr-10 my-5 shadow-md hover:bg-yellow-300 duration-300 transform hover:scale-110"
          >
            <HiPlus size={30} className="hover:scale-110 duration-300" />
          </button>
        )}
      </form>
    </div>
  );
}

export default CreateNoteForm;
