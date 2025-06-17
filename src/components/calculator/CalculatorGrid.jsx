
import React from 'react';
import CalculatorButton from './CalculatorButton';
import { BUTTON_LAYOUT } from '../../utils/calculatorUtils';

const CalculatorGrid = ({ onButtonClick, darkMode }) => {
  return (
    <div className="grid grid-cols-4 gap-3 w-full">
      {BUTTON_LAYOUT.map((row, rowIndex) => 
        row.map((btn, colIndex) => (
          <CalculatorButton
            key={`${rowIndex}-${colIndex}`}
            btn={btn}
            onClick={onButtonClick}
            darkMode={darkMode}
          />
        ))
      )}
    </div>
  );
};

export default CalculatorGrid;
