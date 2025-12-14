import React from "react";

const Switch = ({ isOn, handleToggle }) => {
  return (
    <button
      onClick={handleToggle}
      role="switch"
      aria-checked={isOn}
      className={`
          appearance-none border-none   
          relative                      
          w-14 h-8 rounded-full p-1
          transition-colors duration-300 ease-in-out
          focus:outline-none cursor-pointer
          ${isOn ? 'bg-green-500' : 'bg-gray-600'}
      `}
    >
        <span
            className={`
                absolute top-1 left-1 block  /* Posicionamento fixo dentro do botão */
                bg-white w-6 h-6 rounded-full shadow-md
                transform transition-transform duration-300 ease-out
                ${isOn ? 'translate-x-6' : 'translate-x-0'}
            `}
        />
    </button>
  );
};

export default Switch;