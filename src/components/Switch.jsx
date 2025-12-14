import React from "react";

const Switch = ({ isOn, handleToggle }) => {
  return (
    <div className="switch-container"
        style={{
            position: 'absolute',
            top: '15%',
            right:'10%'
        }}>
        <div
        onClick={handleToggle}
        style={{
            width: '38px',           
            height: '20px',         
            backgroundColor: isOn ? '#22c55e' : '#4b5563', 
            borderRadius: '9999px',  
            position: 'relative',    
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            display: 'flex',         
            flexShrink: 0,            
            alignItems: 'center',
            justifyContent:'space-between',
            boxSizing: 'border-box'
        }}
        >
            {/*Icone de fundo Sustenido */}
            <span style={{
                color: 'white',
                fontWeight: 'bolder',
                fontSize: '11px',
                opacity: isOn ? 1 : 0,
                transition: 'opacity 0.3s',
                marginLeft: '8px'
            }}>♯</span>

            {/* Icone de fundo Bemol */}
            <span style={{
                color: 'white',
                fontWeight: 900,
                fontSize: '11px',
                opacity: isOn ? 0 : 1,
                transition: 'opacity 0.3s',
                marginRight: '8px'
            }}>♭</span>
        {/* BOLINHA */}
        <div
            style={{
            width: '15px',         
            height: '15px',        
            backgroundColor: 'white',
            borderRadius: '50%',   
            position: 'absolute',  
            top: '2px',           
            left: '3px',           
            transition: 'transform 0.3s',
            transform: isOn ? 'translateX(18px)' : 'translateX(0)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isOn ? '#22c55e' : '#4b5563',
            fontWeight: 'bolder',
            fontSize: '12px',
            zIndex: 10
            }}
        >
            {isOn? '♭' : '♯'}
            </div>
        </div>
    </div>
  );
};

export default Switch;