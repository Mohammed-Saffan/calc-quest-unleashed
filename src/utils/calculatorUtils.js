
export const performCalculation = (firstValue, secondValue, operation) => {
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

export const getButtonClass = (btn, darkMode) => {
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

export const BUTTON_LAYOUT = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '=']
];
