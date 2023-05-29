import React from "react";
import Note from "./Note";

const NotesList = ({ notes, onDelete, onEdit }) => {
  // Reverse the notes array to display the latest note first
  const reversedNotes = notes.slice().reverse();

  return (
    <div className="mt-16 mx-9 justify-center place-items-center items-start grid grid-cols-1 md:grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:justify-normal ">
      {reversedNotes.map((noteItem) => (
        <Note
          key={noteItem._id}
          id={noteItem._id}
          title={noteItem.title}
          content={noteItem.content}
          createdAt={noteItem.created_at}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default NotesList;
