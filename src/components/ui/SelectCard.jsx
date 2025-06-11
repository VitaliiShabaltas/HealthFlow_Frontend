import React from 'react';

export function SelectCard({ name, selected, onClick, image }) {
  return (
    <div
      className={`relative w-full max-w-[320px] h-40 border rounded-xl cursor-pointer transition-all 
        overflow-hidden shadow-md 
        ${
          selected
            ? 'border-blue-600 bg-blue-50'
            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
        }`}
      onClick={onClick}
    >
      <div className="absolute top-4 left-4 right-4">
        <h3 className="font-semibold text-base text-gray-800 text-left break-words whitespace-pre-line">
          {name}
        </h3>
      </div>

      {image && (
        <img
          src={image}
          alt="Цифра"
          className="absolute right-[-10px] bottom-[-10px] w-[125px] h-[170px] opacity-10 rotate-[20deg] select-none pointer-events-none"
        />
      )}

      <div className="absolute bottom-0 left-0 h-2 w-full bg-blue-600 z-10"></div>
    </div>
  );
}
