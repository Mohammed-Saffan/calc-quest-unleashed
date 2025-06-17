
import React, { useState, useEffect } from 'react';
import { RotateCcw, Zap, Calculator } from 'lucide-react';

const ScientificCalculator = ({ darkMode }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [memory, setMemory] = useState(0);
  const [angleMode, setAngleMode] = useState('deg');

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

      expression = expression.replace(/sin\(/g, angleMode === 'deg' ? 'Math.sin(Math.PI/180*' : 'Math.sin(');
      expression = expression.replace(/cos\(/g, angleMode === 'deg' ? 'Math.cos(Math.PI/180*' : 'Math.cos(');
      expression = expression.replace(/tan\(/g, angleMode === 'deg' ? 'Math.tan(Math.PI/180*' : 'Math.tan(');
      expression = expression.replace(/log\(/g, 'Math.log10(');
      expression = expression.replace(/ln\(/g, 'Math.log(');
      expression = expression.replace(/√/g, 'Math.sqrt');
      expression = expression.replace(/(\d+\.?\d*)²/g, 'Math.pow($1,2)');
      
      const result = eval(expression);
      const roundedResult = Math.round(result * 1000000000) / 1000000000;
      setDisplay(roundedResult.toString());
      setEquation(equation + ' = ' + roundedResult);
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

    const roundedResult = Math.round(result * 1000000000) / 1000000000;
    setDisplay(roundedResult.toString());
    setEquation(equation + func + '(' + currentValue + ') = ' + roundedResult);
  };

  const getButtonClass = (btn) => {
    const baseClass = "h-12 rounded-lg font-bold text-sm transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 shadow-lg hover:shadow-xl flex items-center justify-center";
    
    if (btn === '=') {
      return `${baseClass} bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white focus:ring-green-300`;
    } else if (['÷', '×', '-', '+'].includes(btn)) {
      return `${baseClass} bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white focus:ring-orange-300`;
    } else if (['sin', 'cos', 'tan', 'log', 'ln', '√', 'x²', 'xʸ'].includes(btn)) {
      return `${baseClass} bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white focus:ring-purple-300`;
    } else if (['C', '(', ')', '±', 'π', 'e', 'M+', 'MC'].includes(btn)) {
      return `${baseClass} bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white focus:ring-gray-300`;
    } else {
      return `${baseClass} bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600 hover:from-blue-200 hover:to-indigo-200 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-800 dark:text-white focus:ring-blue-300`;
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
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Zap className="w-8 h-8 text-purple-600" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Scientific Calculator
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Advanced mathematical functions</p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setAngleMode('deg')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-4 ${
              angleMode === 'deg'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg focus:ring-blue-300'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 focus:ring-gray-300'
            }`}
          >
            DEG
          </button>
          <button
            onClick={() => setAngleMode('rad')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-4 ${
              angleMode === 'rad'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg focus:ring-blue-300'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 focus:ring-gray-300'
            }`}
          >
            RAD
          </button>
        </div>
        {memory !== 0 && (
          <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <Calculator className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              Memory: {memory}
            </span>
          </div>
        )}
      </div>

      {/* Display */}
      <div className="space-y-4">
        <div className="text-right text-gray-500 dark:text-gray-400 text-sm h-8 overflow-hidden bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-600">
          {equation || 'Enter your calculation...'}
        </div>
        <div className="text-right text-4xl font-bold text-gray-800 dark:text-white p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl min-h-[90px] flex items-center justify-end overflow-hidden shadow-inner border-2 border-gray-200 dark:border-gray-600">
          {display}
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-2 w-full">
        {scientificButtons.map((row, rowIndex) => 
          row.map((btn, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleButtonClick(btn)}
              className={getButtonClass(btn)}
              aria-label={btn}
              title={btn === 'M+' ? 'Add to memory' : btn === 'MC' ? 'Clear memory' : btn}
            >
              {btn}
            </button>
          ))
        )}
      </div>

      {/* Tips */}
      <div className="text-center space-y-2 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-center space-x-2">
          <Zap className="w-5 h-5 text-purple-600" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pro Features</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Switch between DEG/RAD • Memory functions • Parentheses support
        </p>
      </div>
    </div>
  );
};

export default ScientificCalculator;
