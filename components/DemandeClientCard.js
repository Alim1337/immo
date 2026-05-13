import React from 'react';
import { HiUsers } from 'react-icons/hi2';

function DemandeClientCard({ text }) {
  return (
    <div className="flex bg-slate-400 items-center gap-x-1 bg-opacity-20 m-2 mt-4 space-x-4 rounded-xl cursor-pointer hover:bg-gray-400 hover:scale-110 transition transform duration-300 ease-out">
      <div className="flex items-center justify-center h-16 w-20 bg-white rounded-lg">
        <HiUsers className="text-gray-500 text-3xl" />
      </div>
      <div>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default DemandeClientCard;
