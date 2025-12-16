import React from "react";

const Switch = ({ isOn, handleToggle }) => {
  return (
    <div
      onClick={handleToggle}
      className={`
        relative inline-flex h-8 w-20 items-center rounded-full cursor-pointer
        transition-colors duration-300 ease-in-out border-2 border-transparent
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 focus-visible:ring-green-500
        ${isOn ? 'bg-green-600' : 'bg-gray-700'}
      `}
    >
      {/* Texto interno (Sustenido/Bemol) no fundo */}
      <span className="absolute left-2 text-[10px] font-bold text-white/50 pointer-events-none">♯</span>
      <span className="absolute right-2 text-[10px] font-bold text-white/50 pointer-events-none">♭</span>

      {/* A Bolinha (Thumb) */}
      <span
        className={`
          flex items-center justify-center
          h-6 w-6 rounded-full bg-white shadow-md transform ring-0 
          transition-transform duration-300 ease-out
          ${isOn ? 'translate-x-12' : 'translate-x-1'}
        `}
      >
        {/* Texto dentro da bolinha */}
        <span className={`text-xs font-bold ${isOn ? 'text-green-600' : 'text-gray-700'}`}>
          {isOn ? '♭' : '♯'}
        </span>
      </span>
    </div>
  );
};

export default Switch;