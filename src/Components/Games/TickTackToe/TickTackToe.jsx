import React, { useRef, useEffect, useState } from 'react';
import './TickTackToe.css';
import { useDispatch } from 'react-redux';
import { setRunningGame, setRunningGameScore } from '../../../Redux/Slices/GameSlice';

function TickTackToe() {
  const dispatch = useDispatch();
  const [gameScore, setGameScore] = useState(1000);
  const canvasRef = useRef(null);

  const cellSize = 110;
  const padding = 10;
  const gridSize = 3;

  const [board, setBoard] = useState(
    Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(null)),
  );
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const drawGrid = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#212121';

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const x = col * (cellSize + padding) + padding;
          const y = row * (cellSize + padding) + padding;

          context.beginPath();
          context.moveTo(x + 10, y);
          context.lineTo(x + cellSize - 10, y);
          context.quadraticCurveTo(x + cellSize, y, x + cellSize, y + 10);
          context.lineTo(x + cellSize, y + cellSize - 10);
          context.quadraticCurveTo(x + cellSize, y + cellSize, x + cellSize - 10, y + cellSize);
          context.lineTo(x + 10, y + cellSize);
          context.quadraticCurveTo(x, y + cellSize, x, y + cellSize - 10);
          context.lineTo(x, y + 10);
          context.quadraticCurveTo(x, y, x + 10, y);
          context.closePath();
          context.fill();

          if (board[row][col] === 'X') {
            drawX(x, y);
          } else if (board[row][col] === 'O') {
            drawO(x, y);
          }
        }
      }
    };

    const drawX = (x, y) => {
      context.strokeStyle = '#5D99F9';
      context.lineWidth = 12;
      context.lineCap = 'round';

      context.beginPath();
      context.moveTo(x + 15, y + 15);
      context.lineTo(x + cellSize - 15, y + cellSize - 15);
      context.moveTo(x + cellSize - 15, y + 15);
      context.lineTo(x + 15, y + cellSize - 15);
      context.stroke();
    };

    const drawO = (x, y) => {
      context.strokeStyle = '#FFFFFF';
      context.lineWidth = 12;
      context.lineCap = 'round';

      context.beginPath();
      context.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2 - 15, 0, 2 * Math.PI);
      context.stroke();
    };

    const drawWinningLine = (start, end) => {
      context.strokeStyle = '#EAC50D'; // Зелёный цвет для линии
      context.lineWidth = 10;
      context.lineCap = 'round';

      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
    };

    const checkWinner = () => {
      const lines = [
        // Горизонтальные линии
        [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 },
        ],
        [
          { row: 1, col: 0 },
          { row: 1, col: 1 },
          { row: 1, col: 2 },
        ],
        [
          { row: 2, col: 0 },
          { row: 2, col: 1 },
          { row: 2, col: 2 },
        ],
        // Вертикальные линии
        [
          { row: 0, col: 0 },
          { row: 1, col: 0 },
          { row: 2, col: 0 },
        ],
        [
          { row: 0, col: 1 },
          { row: 1, col: 1 },
          { row: 2, col: 1 },
        ],
        [
          { row: 0, col: 2 },
          { row: 1, col: 2 },
          { row: 2, col: 2 },
        ],
        // Диагональные линии
        [
          { row: 0, col: 0 },
          { row: 1, col: 1 },
          { row: 2, col: 2 },
        ],
        [
          { row: 0, col: 2 },
          { row: 1, col: 1 },
          { row: 2, col: 0 },
        ],
      ];

      for (let line of lines) {
        const [a, b, c] = line;
        if (
          board[a.row][a.col] &&
          board[a.row][a.col] === board[b.row][b.col] &&
          board[a.row][a.col] === board[c.row][c.col]
        ) {
          if (board[a.row][a.col] === 'X') {
            setGameScore(gameScore * 5);
            dispatch(setRunningGame('GameOver'));
            dispatch(setRunningGameScore(gameScore * 5));
          } else {
            dispatch(setRunningGame('GameOver'));
            dispatch(setRunningGameScore(gameScore));
          }
          console.log(`${board[a.row][a.col]} победил!`);
          const startX = a.col * (cellSize + padding) + padding + cellSize / 2;
          const startY = a.row * (cellSize + padding) + padding + cellSize / 2;
          const endX = c.col * (cellSize + padding) + padding + cellSize / 2;
          const endY = c.row * (cellSize + padding) + padding + cellSize / 2;
          setTimeout(() => drawWinningLine({ x: startX, y: startY }, { x: endX, y: endY }), 100);
          setGameOver(true);
          return board[a.row][a.col];
        }
      }
      return null;
    };

    const handleClick = (event) => {
      if (gameOver) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const x = col * (cellSize + padding) + padding;
          const y = row * (cellSize + padding) + padding;

          if (
            mouseX > x &&
            mouseX < x + cellSize &&
            mouseY > y &&
            mouseY < y + cellSize &&
            !board[row][col]
          ) {
            const newBoard = [...board];
            newBoard[row][col] = 'X';
            setBoard(newBoard);
            drawGrid();
            if (checkWinner()) return;
            setTimeout(computerMove, 500);
          }
        }
      }
    };

    const computerMove = () => {
      if (gameOver) return;

      const emptyCells = [];
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (!board[row][col]) {
            emptyCells.push({ row, col });
          }
        }
      }

      if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { row, col } = emptyCells[randomIndex];
        const newBoard = [...board];
        newBoard[row][col] = 'O';
        setBoard(newBoard);
        drawGrid();
        checkWinner();
      }
    };

    drawGrid();
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, [board, gameOver]);

  return (
    <div className="TickTackToe">
      <div className="TickTackToe-container">
        <div className="game-score">
          <div className="start-score-block">
            <p className="start-score-block-title">Your score:</p>
            <p className="score you-score">1000</p>
          </div>
          <div className="new-score-block">
            <p className="new-score-block-title">Your new score:</p>
            <p className="score you-new-score">{gameScore}</p>
          </div>
        </div>
        <p className="game-rules">Победите в игре, чтобы получить бонус</p>
        <canvas
          width="370px"
          height="370px"
          ref={canvasRef}
          className="TickTackToe-canvas"></canvas>
      </div>
    </div>
  );
}

export default TickTackToe;
