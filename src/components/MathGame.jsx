
import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Trophy, Clock } from 'lucide-react';

const MathGame = ({ darkMode }) => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, finished
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(parseInt(localStorage.getItem('mathGameBestScore')) || 0);
  const [feedback, setFeedback] = useState('');

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

    // Ensure subtraction doesn't go negative for easier difficulties
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
    if (answer === currentProblem.answer) {
      const points = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
      const bonusPoints = streak >= 5 ? Math.floor(streak / 5) : 0;
      setScore(score + points + bonusPoints);
      setStreak(streak + 1);
      setFeedback('🎉 Correct!');
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

  if (gameState === 'menu') {
    return (
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Math Practice Game</h2>
          <p className="text-gray-600 dark:text-gray-300">Test your mental math skills!</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Select Difficulty</h3>
          <div className="space-y-2">
            {[
              { value: 'easy', label: 'Easy (1-10)', points: '1 point per correct answer' },
              { value: 'medium', label: 'Medium (1-50)', points: '2 points per correct answer' },
              { value: 'hard', label: 'Hard (1-100)', points: '3 points per correct answer' }
            ].map((level) => (
              <button
                key={level.value}
                onClick={() => setDifficulty(level.value)}
                className={`w-full p-4 rounded-xl transition-all duration-200 ${
                  difficulty === level.value
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className="font-semibold">{level.label}</div>
                <div className="text-sm opacity-75">{level.points}</div>
              </button>
            ))}
          </div>
        </div>

        {bestScore > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <div className="text-yellow-600 dark:text-yellow-400 font-semibold">
              🏆 Best Score: {bestScore}
            </div>
          </div>
        )}

        <button
          onClick={startGame}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 w-full"
        >
          <Play className="w-6 h-6" />
          <span>Start Game</span>
        </button>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="text-center max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-xl">
            <div className="text-blue-600 dark:text-blue-400 font-bold">Score: {score}</div>
          </div>
          <div className="bg-red-100 dark:bg-red-900 px-4 py-2 rounded-xl flex items-center space-x-2">
            <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
            <div className="text-red-600 dark:text-red-400 font-bold">{timeLeft}s</div>
          </div>
        </div>

        {streak >= 5 && (
          <div className="mb-4 p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
            <div className="text-purple-600 dark:text-purple-400 font-semibold">
              🔥 {streak} Streak! Bonus points active!
            </div>
          </div>
        )}

        {currentProblem && (
          <div className="mb-8">
            <div className="text-6xl font-bold text-gray-800 dark:text-white mb-6 bg-gray-50 dark:bg-gray-900 rounded-2xl py-8">
              {currentProblem.num1} {currentProblem.operation} {currentProblem.num2} = ?
            </div>
            
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full text-4xl text-center p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Your answer"
              autoFocus
            />
            
            <button
              onClick={submitAnswer}
              disabled={!userAnswer}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold text-lg transition-all duration-200"
            >
              Submit Answer
            </button>
          </div>
        )}

        {feedback && (
          <div className={`p-4 rounded-xl font-bold text-lg ${
            feedback.includes('Correct') 
              ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
          }`}>
            {feedback}
          </div>
        )}
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <Trophy className="w-20 h-20 mx-auto text-yellow-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Time's Up!</h2>
          <div className="text-6xl font-bold text-blue-500 mb-2">{score}</div>
          <p className="text-gray-600 dark:text-gray-300">Final Score</p>
        </div>

        {score === bestScore && score > 0 && (
          <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
            <div className="text-yellow-600 dark:text-yellow-400 font-bold text-lg">
              🎉 New Best Score!
            </div>
          </div>
        )}

        <div className="mb-6 space-y-2 text-gray-600 dark:text-gray-300">
          <div>Difficulty: <span className="font-semibold capitalize">{difficulty}</span></div>
          <div>Best Score: <span className="font-semibold">{bestScore}</span></div>
        </div>

        <div className="space-y-3">
          <button
            onClick={startGame}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Play Again</span>
          </button>
          
          <button
            onClick={() => setGameState('menu')}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all duration-200"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }
};

export default MathGame;
