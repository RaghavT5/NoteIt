import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import EditNoteForm from "./EditNoteForm";

function Note(props) {
  const [showEditForm, setShowEditForm] = useState(false);

  const navigate = useNavigate();

  function handleEditClick(id) {
    setShowEditForm(true);
    navigate("notes/edit/" + id);
  }

  function handleDeleteClick() {
    props.onDelete(props.id);
  }

  function handleEditCancel() {
    setShowEditForm(false);
  }

  const formattedDate = new Date(props.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  return (
    <div className="my-5 mr-5 rounded-xl shadow-lg shadow-gray-50 p-3 w-80 float-left border-[1px]">
      <h1 className="font-medium text-2xl mb-2">{props.title}</h1>
      <p
        className="text-xl mb-3 break-words whitespace-pre-wrap"
        id="note-content"
      >
        {props.content}
      </p>
      <div className="flex justify-between items-center">
        <p className="text-gray-500 text-sm">{formattedDate}</p>
        <div className="flex items-center">
          <button
            className="relative bg-yellow-400 rounded-full p-2 mr-3 hover:bg-yellow-300 duration-300 hover:scale-110"
            onClick={() => handleEditClick(props.id)}
          >
            <RiEdit2Fill
              size={20}
              className="text-white duration-300 hover:scale-105"
            />
          </button>
          <button
            className="relative bg-yellow-400 rounded-full p-2 hover:bg-yellow-300 duration-300 hover:scale-110"
            onClick={handleDeleteClick}
          >
            <FaTrash
              size={20}
              className="text-white duration-300 hover:scale-1"
            />
          </button>
        </div>
      </div>
      {showEditForm && (
        <EditNoteForm
          onUpdate={() => {
            toast.success("Note Updated Successfully!");
          }}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
}

export default Note;
