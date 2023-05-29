import React from "react";
import { GiNotebook } from "react-icons/gi";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="bg-yellow-400 fixed left-0 top-0 w-full z-10 ease-in duration-300">
      <div className="max-w-[1920px] m-auto flex justify-center items-center p-4 text-white px-10">
        <Link to="/" className="flex">
          <GiNotebook size={35} className="mx-2" />
          <h1 className="font-bold lg:text-4xl md:text-3xl text-2xl cursor-pointer">
            NoteIt
          </h1>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
