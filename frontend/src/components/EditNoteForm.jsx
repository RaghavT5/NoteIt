import React, { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { HiX } from "react-icons/hi";
import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:5000";

function EditNoteForm(props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { noteId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/notes/${noteId}`)
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        setTitle(response.title);
        setContent(response.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.patch(`/notes/${noteId}`, {
        title,
        content,
        created_at: Date.now(),
      });
      toast.success("Note Updated Successfully!");
      props.fetchNotes();
      navigate("/");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30">
      <div className="w-[720px] mx-8 my-5 px-4 bg-white rounded-lg shadow-lg">
        <form className="flex flex-col">
          <input
            name="title"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
            placeholder="Title"
            required
            className="w-full p-2 text-2xl font-semibold outline-none"
          />

          <TextareaAutosize
            name="content"
            onChange={(event) => setContent(event.target.value)}
            value={content}
            placeholder="Content"
            required
            className="w-full p-2 text-2xl outline-none resize-none"
          />

          <div className="flex justify-end m-5">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-yellow-400 mr-3 rounded-full p-2 text-white shadow-md hover:bg-yellow-300 duration-300 hover:scale-110"
            >
              <FiCheck size={30} className="hover:scale-110 duration-300" />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-400 rounded-full p-2 ml-2 text-white shadow-md hover:bg-red-300 duration-300 hover:scale-110"
            >
              <HiX size={30} className="hover:scale-110 duration-300" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditNoteForm;
