import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { ImCogs } from "react-icons/im";
function GestionCard({ text }) {
  return (
    <div className="flex bg-slate-400 items-center gap-x-1 bg-opacity-20 m-2 mt-4 space-x-4 rounded-xl cursor-pointer hover:bg-gray-400 hover:scale-110 transition transform duration-300 ease-out">
      <div className="flex items-center justify-center h-16 w-16 bg-white rounded-lg">
        <ImCogs className="text-gray-500 text-2xl" />
      </div>
      <div>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default GestionCard;
