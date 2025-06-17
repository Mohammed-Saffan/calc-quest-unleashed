
import React from 'react';
import { Equal } from 'lucide-react';
import { getButtonClass } from '../../utils/calculatorUtils';

const CalculatorButton = ({ btn, onClick, darkMode }) => {
  return (
    <button
      onClick={() => onClick(btn)}
      className={getButtonClass(btn, darkMode)}
      aria-label={btn === '=' ? 'equals' : btn === '÷' ? 'divide' : btn === '×' ? 'multiply' : btn}
    >
      {btn === '=' ? <Equal className="w-6 h-6" /> : btn}
    </button>
  );
};

export default CalculatorButton;
