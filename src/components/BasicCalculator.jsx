
import React, { useState, useEffect } from 'react';
import { Delete, Equal, RotateCcw } from 'lucide-react';

const BasicCalculator = ({ darkMode }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  const handleKeyPress = (event) => {
    const key = event.key;
    if (key >= '0' && key <= '9') {
      handleNumber(key);
    } else if (key === '+' || key === '-') {
      handleOperation(key);
    } else if (key === '*') {
      handleOperation('×');
    } else if (key === '/') {
      event.preventDefault();
      handleOperation('÷');
    } else if (key === 'Enter' || key === '=') {
      event.preventDefault();
      calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
      clear();
    } else if (key === 'Backspace') {
      handleDelete();
    } else if (key === '.') {
      handleNumber('.');
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [display, operation, previousValue]);

  const handleNumber = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num));
      setWaitingForNewValue(false);
      if (operation) {
        setEquation(prev => prev + num);
      } else {
        setEquation(String(num));
      }
    } else {
      if (num === '.' && display.includes('.')) return;
      const newDisplay = display === '0' ? String(num) : display + num;
      setDisplay(newDisplay);
      if (operation && previousValue !== null) {
        setEquation(prev => prev + num);
      } else {
        setEquation(newDisplay);
      }
    }
  };

  const handleOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      setEquation(display + ' ' + nextOperation + ' ');
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = performCalculation(currentValue, inputValue, operation);
      
      setDisplay(String(newValue));
      setPreviousValue(newValue);
      setEquation(equation.split(' ').slice(0, -2).join(' ') + ' ' + nextOperation + ' ');
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const performCalculation = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  const calculate = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = performCalculation(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setEquation(equation + ' = ' + newValue);
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const handleDelete = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
      setEquation(equation.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleSpecial = (type) => {
    const currentValue = parseFloat(display);
    switch (type) {
      case '±':
        const newValue = currentValue * -1;
        setDisplay(String(newValue));
        break;
      case '%':
        const percentValue = currentValue / 100;
        setDisplay(String(percentValue));
        break;
    }
  };

  const getButtonClass = (btn) => {
    const baseClass = "h-16 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 shadow-lg hover:shadow-xl flex items-center justify-center";
    
    if (btn === '=') {
      return `${baseClass} bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white col-span-2 focus:ring-green-300`;
    } else if (['÷', '×', '-', '+'].includes(btn)) {
      return `${baseClass} bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white focus:ring-orange-300`;
    } else if (['C', '±', '%'].includes(btn)) {
      return `${baseClass} bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 hover:from-gray-500 hover:to-gray-600 dark:hover:from-gray-500 dark:hover:to-gray-600 text-white focus:ring-gray-300`;
    } else if (btn === '0') {
      return `${baseClass} bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600 hover:from-blue-200 hover:to-indigo-200 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-800 dark:text-white col-span-2 focus:ring-blue-300`;
    } else {
      return `${baseClass} bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600 hover:from-blue-200 hover:to-indigo-200 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-800 dark:text-white focus:ring-blue-300`;
    }
  };

  const handleButtonClick = (btn) => {
    if (btn >= '0' && btn <= '9' || btn === '.') {
      handleNumber(btn);
    } else if (['÷', '×', '-', '+'].includes(btn)) {
      handleOperation(btn);
    } else if (btn === '=') {
      calculate();
    } else if (btn === 'C') {
      clear();
    } else if (['±', '%'].includes(btn)) {
      handleSpecial(btn);
    }
  };

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
      <div className="space-y-4">
        <div className="text-right text-gray-500 dark:text-gray-400 text-lg h-8 overflow-hidden bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-600">
          {equation || 'Ready to calculate...'}
        </div>
        <div className="text-right text-5xl font-bold text-gray-800 dark:text-white p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl min-h-[100px] flex items-center justify-end overflow-hidden shadow-inner border-2 border-gray-200 dark:border-gray-600">
          {display}
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-3 w-full">
        {buttons.map((row, rowIndex) => 
          row.map((btn, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleButtonClick(btn)}
              className={getButtonClass(btn)}
              aria-label={btn === '=' ? 'equals' : btn === '÷' ? 'divide' : btn === '×' ? 'multiply' : btn}
            >
              {btn === '=' ? <Equal className="w-6 h-6" /> : btn}
            </button>
          ))
        )}
      </div>

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
