
import React, { useState, useEffect } from 'react';

const ScientificCalculator = ({ darkMode }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [memory, setMemory] = useState(0);
  const [angleMode, setAngleMode] = useState('deg'); // deg or rad

  const scientificButtons = [
    ['C', '(', ')', '÷'],
    ['sin', 'cos', 'tan', '×'],
    ['log', 'ln', 'e', '-'],
    ['√', 'x²', 'xʸ', '+'],
    ['π', '7', '8', '9'],
    ['±', '4', '5', '6'],
    ['M+', '1', '2', '3'],
    ['MC', '0', '.', '=']
  ];

  const handleKeyPress = (event) => {
    const key = event.key;
    if (key >= '0' && key <= '9') {
      handleInput(key);
    } else if (['+', '-'].includes(key)) {
      handleInput(key);
    } else if (key === '*') {
      handleInput('×');
    } else if (key === '/') {
      event.preventDefault();
      handleInput('÷');
    } else if (key === 'Enter' || key === '=') {
      event.preventDefault();
      calculate();
    } else if (key === 'Escape') {
      clear();
    } else if (key === '.') {
      handleInput('.');
    } else if (key === '(' || key === ')') {
      handleInput(key);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleInput = (value) => {
    if (display === '0' && !isNaN(value)) {
      setDisplay(value);
      setEquation(value);
    } else {
      setDisplay(display + value);
      setEquation(equation + value);
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  const calculate = () => {
    try {
      let expression = equation
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, Math.PI)
        .replace(/e/g, Math.E);

      // Handle scientific functions
      expression = expression.replace(/sin\(/g, angleMode === 'deg' ? 'Math.sin(Math.PI/180*' : 'Math.sin(');
      expression = expression.replace(/cos\(/g, angleMode === 'deg' ? 'Math.cos(Math.PI/180*' : 'Math.cos(');
      expression = expression.replace(/tan\(/g, angleMode === 'deg' ? 'Math.tan(Math.PI/180*' : 'Math.tan(');
      expression = expression.replace(/log\(/g, 'Math.log10(');
      expression = expression.replace(/ln\(/g, 'Math.log(');
      expression = expression.replace(/√/g, 'Math.sqrt');
      expression = expression.replace(/(\d+\.?\d*)²/g, 'Math.pow($1,2)');
      
      const result = eval(expression);
      setDisplay(result.toString());
      setEquation(equation + ' = ' + result);
    } catch (error) {
      setDisplay('Error');
      setTimeout(() => {
        clear();
      }, 2000);
    }
  };

  const handleFunction = (func) => {
    const currentValue = parseFloat(display);
    let result;

    switch (func) {
      case 'sin':
        result = angleMode === 'deg' 
          ? Math.sin(currentValue * Math.PI / 180)
          : Math.sin(currentValue);
        break;
      case 'cos':
        result = angleMode === 'deg'
          ? Math.cos(currentValue * Math.PI / 180)
          : Math.cos(currentValue);
        break;
      case 'tan':
        result = angleMode === 'deg'
          ? Math.tan(currentValue * Math.PI / 180)
          : Math.tan(currentValue);
        break;
      case 'log':
        result = Math.log10(currentValue);
        break;
      case 'ln':
        result = Math.log(currentValue);
        break;
      case '√':
        result = Math.sqrt(currentValue);
        break;
      case 'x²':
        result = Math.pow(currentValue, 2);
        break;
      case '±':
        result = currentValue * -1;
        break;
      case 'π':
        setDisplay(Math.PI.toString());
        setEquation(equation + Math.PI);
        return;
      case 'e':
        setDisplay(Math.E.toString());
        setEquation(equation + Math.E);
        return;
      case 'M+':
        setMemory(memory + currentValue);
        return;
      case 'MC':
        setMemory(0);
        return;
      default:
        return;
    }

    setDisplay(result.toString());
    setEquation(equation + func + '(' + currentValue + ') = ' + result);
  };

  const getButtonClass = (btn) => {
    const baseClass = "h-12 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105 active:scale-95";
    
    if (btn === '=') {
      return `${baseClass} bg-blue-500 hover:bg-blue-600 text-white shadow-lg`;
    } else if (['÷', '×', '-', '+'].includes(btn)) {
      return `${baseClass} bg-orange-500 hover:bg-orange-600 text-white shadow-lg`;
    } else if (['sin', 'cos', 'tan', 'log', 'ln', '√', 'x²', 'xʸ'].includes(btn)) {
      return `${baseClass} bg-purple-500 hover:bg-purple-600 text-white shadow-lg`;
    } else if (['C', '(', ')', '±', 'π', 'e', 'M+', 'MC'].includes(btn)) {
      return `${baseClass} bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white`;
    } else {
      return `${baseClass} bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white`;
    }
  };

  const handleButtonClick = (btn) => {
    if (btn >= '0' && btn <= '9' || btn === '.' || ['(', ')', '+', '-', '×', '÷'].includes(btn)) {
      handleInput(btn);
    } else if (btn === '=') {
      calculate();
    } else if (btn === 'C') {
      clear();
    } else {
      handleFunction(btn);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setAngleMode('deg')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              angleMode === 'deg'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white'
            }`}
          >
            DEG
          </button>
          <button
            onClick={() => setAngleMode('rad')}
            className={`px-3 py-1 rounded text-sm font-medium ${
              angleMode === 'rad'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white'
            }`}
          >
            RAD
          </button>
        </div>
        {memory !== 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Memory: {memory}
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="text-right text-gray-500 dark:text-gray-400 text-sm mb-2 h-6 overflow-hidden">
          {equation}
        </div>
        <div className="text-right text-3xl font-bold text-gray-800 dark:text-white p-4 bg-gray-50 dark:bg-gray-900 rounded-xl min-h-[70px] flex items-center justify-end overflow-hidden">
          {display}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {scientificButtons.flat().map((btn, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(btn)}
            className={getButtonClass(btn)}
          >
            {btn}
          </button>
        ))}
      </div>

      <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        🧮 Advanced mathematical functions at your fingertips
      </div>
    </div>
  );
};

export default ScientificCalculator;
