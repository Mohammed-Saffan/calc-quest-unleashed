
import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Trophy, Clock, Zap, Target, Award } from 'lucide-react';

const MathGame = ({ darkMode }) => {
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(parseInt(localStorage.getItem('mathGameBestScore')) || 0);
  const [feedback, setFeedback] = useState('');
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  useEffect(() => {
    if (gameState === 'playing' && !currentProblem) {
      generateProblem();
    }
  }, [gameState, currentProblem]);

  const generateProblem = () => {
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2, answer;
    
    switch (difficulty) {
      case 'easy':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        break;
      case 'medium':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        break;
      case 'hard':
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 100) + 1;
        break;
    }

    if (operation === '-' && difficulty === 'easy' && num2 > num1) {
      [num1, num2] = [num2, num1];
    }

    switch (operation) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        answer = num1 - num2;
        break;
      case '×':
        answer = num1 * num2;
        break;
    }

    setCurrentProblem({ num1, num2, operation, answer });
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(60);
    setStreak(0);
    setCurrentProblem(null);
    setUserAnswer('');
    setFeedback('');
    setTotalAnswered(0);
    setCorrectAnswers(0);
  };

  const endGame = () => {
    setGameState('finished');
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('mathGameBestScore', score.toString());
    }
  };

  const submitAnswer = () => {
    const answer = parseInt(userAnswer);
    setTotalAnswered(totalAnswered + 1);
    
    if (answer === currentProblem.answer) {
      const points = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
      const bonusPoints = streak >= 5 ? Math.floor(streak / 5) : 0;
      setScore(score + points + bonusPoints);
      setStreak(streak + 1);
      setCorrectAnswers(correctAnswers + 1);
      setFeedback('🎉 Correct! +' + (points + bonusPoints) + ' points');
    } else {
      setStreak(0);
      setFeedback(`❌ Wrong! Answer was ${currentProblem.answer}`);
    }
    
    setTimeout(() => {
      setFeedback('');
      setUserAnswer('');
      generateProblem();
    }, 1000);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && userAnswer && gameState === 'playing') {
      submitAnswer();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [userAnswer, gameState]);

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'easy': return 'from-green-500 to-emerald-600';
      case 'medium': return 'from-yellow-500 to-orange-600';
      case 'hard': return 'from-red-500 to-pink-600';
      default: return 'from-blue-500 to-purple-600';
    }
  };

  const getAccuracy = () => {
    return totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;
  };

  if (gameState === 'menu') {
    return (
      <div className="text-center max-w-lg mx-auto space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Trophy className="w-12 h-12 text-yellow-500" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
              Math Challenge
            </h2>
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Test your mental math skills in 60 seconds!</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center justify-center space-x-2">
              <Target className="w-6 h-6" />
              <span>Choose Your Challenge</span>
            </h3>
            <div className="space-y-3">
              {[
                { value: 'easy', label: 'Easy Mode', range: '1-10', points: '1 point per correct', icon: '🟢' },
                { value: 'medium', label: 'Medium Mode', range: '1-50', points: '2 points per correct', icon: '🟡' },
                { value: 'hard', label: 'Hard Mode', range: '1-100', points: '3 points per correct', icon: '🔴' }
              ].map((level) => (
                <button
                  key={level.value}
                  onClick={() => setDifficulty(level.value)}
                  className={`w-full p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${
                    difficulty === level.value
                      ? `bg-gradient-to-r ${getDifficultyColor(level.value)} text-white shadow-2xl scale-105`
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 shadow-lg hover:shadow-xl border-2 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="flex items-center space-x-2 text-lg font-bold">
                        <span>{level.icon}</span>
                        <span>{level.label}</span>
                      </div>
                      <div className="text-sm opacity-90 mt-1">Numbers: {level.range}</div>
                      <div className="text-xs opacity-75 mt-1">{level.points}</div>
                    </div>
                    <Award className="w-8 h-8 opacity-50" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {bestScore > 0 && (
            <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-center space-x-2">
                <Trophy className="w-6 h-6 text-yellow-600" />
                <span className="text-yellow-700 dark:text-yellow-300 font-bold text-lg">
                  Best Score: {bestScore} points
                </span>
              </div>
            </div>
          )}

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 rounded-2xl font-bold text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <Play className="w-8 h-8" />
            <span>Start Challenge</span>
            <Zap className="w-8 h-8" />
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="text-center max-w-lg mx-auto space-y-8">
        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-2xl shadow-lg">
            <div className="text-2xl font-bold">{score}</div>
            <div className="text-xs opacity-90">Score</div>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-center space-x-2">
            <Clock className="w-5 h-5" />
            <div>
              <div className="text-2xl font-bold">{timeLeft}</div>
              <div className="text-xs opacity-90">Seconds</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg">
            <div className="text-2xl font-bold">{getAccuracy()}%</div>
            <div className="text-xs opacity-90">Accuracy</div>
          </div>
        </div>

        {/* Streak Indicator */}
        {streak >= 3 && (
          <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl border-2 border-purple-200 dark:border-purple-700 animate-pulse">
            <div className="flex items-center justify-center space-x-2">
              <Zap className="w-6 h-6 text-purple-600" />
              <span className="text-purple-700 dark:text-purple-300 font-bold text-lg">
                🔥 {streak} Streak! {streak >= 5 ? 'Bonus points active!' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Problem Display */}
        {currentProblem && (
          <div className="space-y-6">
            <div className="text-7xl font-bold text-gray-800 dark:text-white bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl py-12 px-6 shadow-2xl border-4 border-gray-200 dark:border-gray-600">
              {currentProblem.num1} {currentProblem.operation} {currentProblem.num2} = ?
            </div>
            
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full text-5xl text-center p-6 border-4 border-blue-300 dark:border-blue-600 rounded-2xl focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700"
              placeholder="?"
              autoFocus
            />
            
            <button
              onClick={submitAnswer}
              disabled={!userAnswer}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-bold text-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              Submit Answer
            </button>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className={`p-6 rounded-2xl font-bold text-xl shadow-lg animate-bounce ${
            feedback.includes('Correct') 
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-700'
              : 'bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-700 dark:text-red-300 border-2 border-red-200 dark:border-red-700'
          }`}>
            {feedback}
          </div>
        )}
      </div>
    );
  }

  if (gameState === 'finished') {
    const isNewRecord = score === bestScore && score > 0;
    
    return (
      <div className="text-center max-w-lg mx-auto space-y-8">
        <div className="space-y-6">
          <div className="flex items-center justify-center space-x-4">
            <Trophy className={`w-16 h-16 ${isNewRecord ? 'text-yellow-500 animate-bounce' : 'text-gray-400'}`} />
            <div>
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white">Challenge Complete!</h2>
              <div className="text-8xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mt-2">
                {score}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Final Score</p>
            </div>
          </div>

          {isNewRecord && (
            <div className="p-6 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl border-2 border-yellow-200 dark:border-yellow-700 animate-pulse">
              <div className="flex items-center justify-center space-x-2">
                <Award className="w-8 h-8 text-yellow-600" />
                <span className="text-yellow-700 dark:text-yellow-300 font-bold text-xl">
                  🎉 New Best Score!
                </span>
              </div>
            </div>
          )}

          {/* Game Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalAnswered}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Problems Attempted</div>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{getAccuracy()}%</div>
              <div className="text-sm text-green-700 dark:text-green-300">Accuracy Rate</div>
            </div>
          </div>

          <div className="space-y-2 text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <span>Difficulty:</span>
              <span className="font-semibold capitalize">{difficulty}</span>
            </div>
            <div className="flex justify-between">
              <span>Best Score:</span>
              <span className="font-semibold">{bestScore}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            <RotateCcw className="w-6 h-6" />
            <span>Play Again</span>
          </button>
          
          <button
            onClick={() => setGameState('menu')}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-300"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }
};

export default MathGame;
