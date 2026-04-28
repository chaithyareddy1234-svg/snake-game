import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't land on snake
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        if (direction.y === 0) setNextDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y === 0) setNextDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x === 0) setNextDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x === 0) setNextDirection({ x: 1, y: 0 });
        break;
      case ' ':
        if (gameOver || !gameStarted) resetGame();
        break;
    }
  }, [direction, gameOver, gameStarted]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        const newHead = {
          x: head.x + nextDirection.x,
          y: head.y + nextDirection.y,
        };

        setDirection(nextDirection);

        // Collision Check (Wall)
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Collision Check (Self)
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food Check
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, Math.max(50, BASE_SPEED - Math.floor(score / 50) * 5));
    return () => clearInterval(intervalId);
  }, [gameStarted, gameOver, nextDirection, food, score, generateFood]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="mb-6 flex space-x-12 font-display uppercase tracking-widest">
        <div className="flex flex-col items-center">
          <span className="text-xs text-zinc-500">Score</span>
          <span className="text-2xl neon-text-blue">{score}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-zinc-500">High Score</span>
          <span className="text-2xl neon-text-pink">{highScore}</span>
        </div>
      </div>

      <div 
        className="relative bg-zinc-950 neon-border p-1 overflow-hidden" 
        style={{ width: GRID_SIZE * 20, height: GRID_SIZE * 20 }}
      >
        <div 
          className="grid gap-0 w-full h-full"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` 
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.slice(1).some(s => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className={`w-full h-full border-[0.5px] border-zinc-800/10 flex items-center justify-center transition-colors duration-200`}
              >
                {isSnakeHead && (
                  <motion.div 
                    layoutId="snake-head"
                    className="w-full h-full bg-neon-blue rounded-sm shadow-[0_0_10px_#00ffff]" 
                  />
                )}
                {isSnakeBody && (
                  <div className="w-[85%] h-[85%] bg-neon-blue/40 rounded-sm" />
                )}
                {isFood && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-[60%] h-[60%] bg-neon-pink rounded-full shadow-[0_0_15px_#ff00ff]"
                  />
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {(!gameStarted || gameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10"
            >
              <h2 className="text-4xl font-display neon-text-pink mb-4">
                {gameOver ? 'GAME OVER' : 'NEON SNAKE'}
              </h2>
              {gameOver && (
                <div className="flex items-center gap-2 mb-6 text-zinc-400">
                  <Trophy className="w-4 h-4" />
                  <span>Your Score: {score}</span>
                </div>
              )}
              <button
                onClick={resetGame}
                className="group relative px-8 py-3 bg-transparent overflow-hidden"
              >
                <div className="absolute inset-0 border border-neon-blue group-hover:bg-neon-blue/10 transition-colors" />
                <div className="relative flex items-center gap-2 text-neon-blue font-bold tracking-widest uppercase text-sm">
                  <RotateCcw className="w-4 h-4" />
                  {gameOver ? 'Try Again' : 'Start Mission'}
                </div>
              </button>
              {!gameOver && (
                <p className="mt-8 text-xs text-zinc-500 uppercase tracking-[0.3em]">
                  Use Arrows to Navigate
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex gap-4 text-xs font-mono text-zinc-600 uppercase tracking-widest">
        <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">ARROWS</kbd> MOVE</span>
        <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">SPACE</kbd> RESTART</span>
      </div>
    </div>
  );
}
