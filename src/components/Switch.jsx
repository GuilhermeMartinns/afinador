import React from "react";

const Switch = ({ isOn, handleToggle }) => {
  return (
    <button
    onClick={handleToggle}
    role="switch"
    aria-checked={isOn}
    className={`
        w-14 h-8 rounded-full p-1
        flex items-center
        transition-colors duration-300 ease in out
        focuts:outline-none
        ${isOn ? 'bg-green-500' : 'bg-gray-300'}
        `}
    >
        <div
            className={`
                bg-white w-6 h-6 rounded-full shadow-md
                transform transition-transform duration-300 ease-in-out
                ${isOn ? 'translate-x-6' : 'translate-x-0'}
                `}
        />
    </button>
  );
};

export default Switch;