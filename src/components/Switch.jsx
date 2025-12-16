import React from "react";

const Switch = ({ isOn, handleToggle }) => {
  return (
    <div
      onClick={handleToggle}
      className={`
        relative inline-flex h-8 w-16 items-center rounded-full cursor-pointer
        transition-colors duration-300 ease-in-out border-2 border-transparent
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:ring-green-500
        bg-green-500
      `}
    >
      {/* Texto interno (Sustenido/Bemol) no fundo */}
      <span className="absolute left-3.5 text-[15px] font-black text-white/90 pointer-events-none">♯</span>
      <span className="absolute right-3.5 text-[15px] font-black text-white/90 pointer-events-none">♭</span>

      {/* A Bolinha (Thumb) */}
      <span
        className={`
          flex items-center justify-center
          h-6 w-6 rounded-full bg-white shadow-md transform ring-0 
          transition-transform duration-300 ease-out
          ${isOn ? 'translate-x-8' : 'translate-x-1'}
        `}
      >
        {/* Texto dentro da bolinha */}
        <span className={`text-lg font-black ${isOn ? 'text-green-600' : 'text-gray-700'}`}>
          {isOn ? '♭' : '♯'}
        </span>
      </span>
    </div>
  );
};

export default Switch;