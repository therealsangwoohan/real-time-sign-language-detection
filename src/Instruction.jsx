import React from 'react';
import instructionImg from './images/instruction.jpg';

export default function Instruction() {
  return (
    <div className="Instruction">
      <h1>Instruction</h1>
      <p>Use your right hand and imitate the 5 gestures shown below.</p>
      <img src={instructionImg} alt="" />
    </div>
  );
}
