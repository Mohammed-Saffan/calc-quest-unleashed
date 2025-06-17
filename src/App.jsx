
import React, { useState } from 'react';
import { Calculator, FlaskConical, Gamepad2, Sun, Moon, Sparkles } from 'lucide-react';
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
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'dark bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Enhanced Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Math Suite Pro
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg font-medium">
                Your complete mathematics toolkit with style
              </p>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className="group p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-gray-700"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <Sun className="w-7 h-7 text-yellow-500 group-hover:rotate-180 transition-transform duration-500" />
            ) : (
              <Moon className="w-7 h-7 text-indigo-600 group-hover:rotate-12 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg p-2 rounded-2xl shadow-2xl mb-10 border border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-600 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:shadow-lg'
                }`}
                aria-pressed={activeTab === tab.id}
              >
                <Icon className="w-6 h-6" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Enhanced Active Component Container */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 min-h-[700px] border border-gray-200 dark:border-gray-700 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-30 -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100 to-yellow-100 dark:from-pink-900/20 dark:to-yellow-900/20 rounded-full blur-3xl opacity-30 translate-y-24 -translate-x-24"></div>
          
          {/* Component content */}
          <div className="relative z-10">
            {ActiveComponent && <ActiveComponent darkMode={darkMode} />}
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-12 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Made with precision and care</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Math Suite Pro - Empowering mathematical excellence since 2024
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
