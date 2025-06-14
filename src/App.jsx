
import React, { useState } from 'react';
import { Calculator, FlaskConical, Gamepad2, Sun, Moon } from 'lucide-react';
import BasicCalculator from './components/BasicCalculator';
import ScientificCalculator from './components/ScientificCalculator';
import MathGame from './components/MathGame';

function App() {
  const [activeTab, setActiveTab] = useState('basic');
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const tabs = [
    { id: 'basic', name: 'Basic', icon: Calculator, component: BasicCalculator },
    { id: 'scientific', name: 'Scientific', icon: FlaskConical, component: ScientificCalculator },
    { id: 'game', name: 'Math Game', icon: Gamepad2, component: MathGame }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Math Suite 2.0
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Your complete mathematics toolkit</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {darkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-indigo-600" />}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-lg mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-md transform scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Component */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 min-h-[600px]">
          {ActiveComponent && <ActiveComponent darkMode={darkMode} />}
        </div>
      </div>
    </div>
  );
}

export default App;
