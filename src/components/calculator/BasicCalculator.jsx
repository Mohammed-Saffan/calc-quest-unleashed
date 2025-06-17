
import React from 'react';
import CalculatorDisplay from './CalculatorDisplay';
import CalculatorGrid from './CalculatorGrid';
import { useCalculator } from '../../hooks/useCalculator';

const BasicCalculator = ({ darkMode }) => {
  const { display, equation, handleButtonClick } = useCalculator();

  return (
    <div className="max-w-md mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Basic Calculator
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Perfect for everyday calculations</p>
      </div>

      {/* Display */}
      <CalculatorDisplay display={display} equation={equation} />

      {/* Buttons Grid */}
      <CalculatorGrid onButtonClick={handleButtonClick} darkMode={darkMode} />

      {/* Helpful Tips */}
      <div className="text-center space-y-2 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-2xl">⌨️</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Keyboard shortcuts available!</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Use number keys, +, -, *, /, Enter (=), Escape (C), Backspace
        </p>
      </div>
    </div>
  );
};

export default BasicCalculator;
