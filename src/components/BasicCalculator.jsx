
import React, { useState, useEffect } from 'react';
import { Delete, Equal } from 'lucide-react';

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
    const baseClass = "h-16 rounded-xl font-semibold text-xl transition-all duration-200 transform hover:scale-105 active:scale-95";
    
    if (btn === '=') {
      return `${baseClass} bg-blue-500 hover:bg-blue-600 text-white shadow-lg col-span-2`;
    } else if (['÷', '×', '-', '+'].includes(btn)) {
      return `${baseClass} bg-orange-500 hover:bg-orange-600 text-white shadow-lg`;
    } else if (['C', '±', '%'].includes(btn)) {
      return `${baseClass} bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white`;
    } else if (btn === '0') {
      return `${baseClass} bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white col-span-2`;
    } else {
      return `${baseClass} bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white`;
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
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <div className="text-right text-gray-500 dark:text-gray-400 text-lg mb-2 h-8 overflow-hidden">
          {equation}
        </div>
        <div className="text-right text-4xl font-bold text-gray-800 dark:text-white p-4 bg-gray-50 dark:bg-gray-900 rounded-xl min-h-[80px] flex items-center justify-end overflow-hidden">
          {display}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {buttons.flat().map((btn, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(btn)}
            className={getButtonClass(btn)}
          >
            {btn === '=' && <Equal className="w-6 h-6 mx-auto" />}
            {btn !== '=' && btn}
          </button>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        💡 Use your keyboard for faster input!
      </div>
    </div>
  );
};

export default BasicCalculator;
