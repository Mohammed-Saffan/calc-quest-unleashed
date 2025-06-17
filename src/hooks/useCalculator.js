
import { useState, useEffect } from 'react';
import { performCalculation } from '../utils/calculatorUtils';

export const useCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

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

  return {
    display,
    equation,
    handleButtonClick
  };
};
