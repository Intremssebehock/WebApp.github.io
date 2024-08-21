import React, { useRef, useEffect, useState } from 'react';
import './Sapper.css';
import { useDispatch, useSelector } from 'react-redux';
import { setRunningGame, setRunningGameScore } from '../../../Redux/Slices/GameSlice';

function Sapper() {
  const runningGame = useSelector((state) => state.game.runningGame);
  const dispatch = useDispatch();
  const canvasRef = useRef();
  const [cells, setCells] = useState();
  const [game, setGame] = useState(false);
  const [gameScore, setGameScore] = useState(1000);

  const gridSize = { rows: 7, cols: 5 };
  const squareSize = 58;
  const spacing = 11;
  const borderRadius = 10; // Радиус скругления углов

  const cb = 0.3;
  let blocks = Array();

  const plusOne = (h, w) => {
    if (h >= 0 && h <= gridSize.rows - 1 && w >= 0 && w <= gridSize.cols - 1) {
      if (blocks[h][w].number != 9) {
        blocks[h][w].number++;
      }
    }
  };

  const startGame = () => {
    for (let h = 0; h < gridSize.rows; h++) {
      let whline = Array();
      for (let w = 0; w < gridSize.cols; w++) {
        if (Math.random() < cb) {
          whline.push({ number: 9, show: false });
        } else {
          whline.push({ number: 0, show: false });
        }
      }
      blocks.push(whline);
    }
    for (let h = 0; h < gridSize.rows; h++) {
      for (let w = 0; w < gridSize.cols; w++) {
        if (blocks[h][w].number == 9) {
          plusOne(h, w - 1);
          plusOne(h, w + 1);
          plusOne(h - 1, w);
          plusOne(h + 1, w);
          plusOne(h - 1, w - 1);
          plusOne(h + 1, w - 1);
          plusOne(h - 1, w + 1);
          plusOne(h + 1, w + 1);
        }
      }
    }
    setCells(blocks);
    setGame(true);
  };

  // Функция для рисования одного квадрата с скругленными углами
  const drawRoundedRect = (ctx, x, y, size, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + size, y, x + size, y + size, radius);
    ctx.arcTo(x + size, y + size, x, y + size, radius);
    ctx.arcTo(x, y + size, x, y, radius);
    ctx.arcTo(x, y, x + size, y, radius);
    ctx.closePath();
    ctx.fill();
  };

  // Рисуем все квадраты
  const drawGrid = (ctx) => {
    try {
      for (let row = 0; row < gridSize.rows; row++) {
        for (let col = 0; col < gridSize.cols; col++) {
          ctx.fillStyle = '#212121'; // Цвет фона квадратика
          if (cells[row][col].show === true) {
            if (cells[row][col].number === 0) {
              ctx.fillStyle = '#181818'; // Цвет фона квадратика
            } else if (cells[row][col].number === 9) {
              ctx.fillStyle = '#6F1D1B'; // Цвет фона квадратика
            } else {
              ctx.fillStyle = 'rgba(234, 197, 13, 0.30)'; // Цвет фона квадратика
            }
          }
          const x = col * (squareSize + spacing);
          const y = row * (squareSize + spacing);
          drawRoundedRect(ctx, x, y, squareSize, borderRadius);

          if (cells[row][col].show === true) {
            ctx.fillStyle = '#FFF'; // Цвет текста
            ctx.font = '24px Open Sans'; // Шрифт и размер
            ctx.textAlign = 'center'; // Выравнивание текста по центру
            ctx.textBaseline = 'middle'; // Вертикальное выравнивание текста

            // Рисуем текст с заполнением
            if (cells[row][col].number === 0) {
              ctx.fillText(`${cells[row][col].number}`, x + squareSize / 2, y + squareSize / 2);
            } else if (cells[row][col].number === 9) {
              ctx.fillText(`${cells[row][col].number}`, x + squareSize / 2, y + squareSize / 3);
              ctx.fillStyle = '#FF2F2A'; // Цвет текста
              ctx.font = 'bold 16px Erica One'; // Шрифт и размер
              ctx.fillText(`-3000`, x + squareSize / 2, y + squareSize / 1.3);
            } else {
              ctx.fillText(`${cells[row][col].number}`, x + squareSize / 2, y + squareSize / 3);
              ctx.fillStyle = '#EAC50D'; // Цвет текста
              ctx.font = '16px Erica One'; // Шрифт и размер
              ctx.fillText(
                `${(cells[row][col].number * 1000) / 2}`,
                x + squareSize / 2,
                y + squareSize / 1.3,
              );
            }
          }
        }
      }
    } catch (error) {
      console.error('Error drawing grid:', error);
    }
  };

  const draw = (ctx) => {
    drawGrid(ctx);
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    canvas.style.width = canvas.width;
    canvas.style.height = canvas.height;
    canvas.width = canvas.width * 2;
    canvas.height = canvas.height * 2;
    canvas.getContext('2d').scale(2, 2);

    startGame();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up an interval to call the draw function every second
    draw(ctx);

    // Clean up the interval on component unmount
  }, [cells]);

  const handleClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / (squareSize + spacing));
    const row = Math.floor(y / (squareSize + spacing));

    if (row >= 0 && row < gridSize.rows && col >= 0 && col < gridSize.cols) {
      //console.log(`Clicked cell: Row ${row}, Column ${col}`);
      const newCells = cells.map((rowArray, rIndex) =>
        rowArray.map((cell, cIndex) => {
          if (rIndex === row && cIndex === col) {
            return { ...cell, show: true };
          }
          return cell;
        }),
      );

      setCells(newCells);
      if (cells[row][col].number === 9) {
        let newScore = gameScore;
        setGameScore(newScore - 3000);
      } else {
        setGameScore(gameScore + (cells[row][col].number * 1000) / 2);
      }
    }
  };

  return (
    <div className="Sapper">
      <div className="Sapper-container">
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
        <div className="gameGrid">
          <p className="manual">
            Цифра показывает, сколько соседних клеточек безопасны. В других спрятана бомба. Найдите
            как можно больше безопасных клеточек.
          </p>
          <canvas
            onClick={handleClick}
            ref={canvasRef}
            width="335px"
            height="473px"
            className="Sapper-canvas"></canvas>
          <div
            className="end-game"
            onClick={() => {
              dispatch(setRunningGameScore(gameScore));
              dispatch(setRunningGame('GameOver'));
            }}>
            <p>Завешить</p>
            <div
              className={`final-score ${gameScore >= 0 ? 'final-score-win' : 'final-score-lose'}`}>
              <p>{`${gameScore >= 0 ? '+' + gameScore : gameScore}`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sapper;
