
import React from 'react';

const CalculatorDisplay = ({ display, equation }) => {
  return (
    <div className="space-y-4">
      <div className="text-right text-gray-500 dark:text-gray-400 text-lg h-8 overflow-hidden bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-600">
        {equation || 'Ready to calculate...'}
      </div>
      <div className="text-right text-5xl font-bold text-gray-800 dark:text-white p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl min-h-[100px] flex items-center justify-end overflow-hidden shadow-inner border-2 border-gray-200 dark:border-gray-600">
        {display}
      </div>
    </div>
  );
};

export default CalculatorDisplay;
