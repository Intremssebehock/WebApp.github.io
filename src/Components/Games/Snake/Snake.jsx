import React, { useRef, useEffect, useState, useCallback } from 'react';
import './Snake.css';
import { useDispatch, useSelector } from 'react-redux';
import { setRunningGame } from '../../../Redux/Slices/GameSlice';

function Snake() {
  const game = useSelector((state) => state.game.runningGame);
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const [squareSize, setSquareSize] = useState();
  const [gameId, setGameId] = useState();
  const [gameScore, setGameScore] = useState(0);
  const [bonus, setBonus] = useState({});
  const [snake, setSnake] = useState([]);
  const [direction, setDirection] = useState('');
  const [lastDirection, setLastDirection] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [bonusAnim, setBonusAnim] = useState();
  const [spikes, setSpikes] = useState([]);

  const padding = 15;
  const rows = 6;
  const cols = 4;
  const bonusProfit = 5;

  const checkBonusCollision = () => {
    const head = snake[0];
    const distanceX = head.x - bonus.x + padding;
    const distanceY = head.y - bonus.y + padding;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    return distance < squareSize / 2;
  };

  const checkWallCollision = () => {
    try {
      const head = snake[0];
      return (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvasRef.current.width / 2 - padding * 3 ||
        head.y >= canvasRef.current.height / 2 - padding * 3
      );
    } catch {}
  };

  const checkSelfCollision = () => {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true;
      }
    }
    return false;
  };

  const checkSpikeCollision = () => {
    const head = snake[0];
    for (let i = 0; i < spikes.length; i++) {
      const spike = spikes[i];
      const distanceX = head.x - spike.x + padding;
      const distanceY = head.y - spike.y + padding;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      if (distance < squareSize / 2) {
        return true; // Столкновение с шипом
      }
    }
    return false;
  };

  const drawRoundedRect = (ctx, x, y, width, height, radius, side) => {
    ctx.fillStyle = 'white'; // Цвет квадратиков
    ctx.beginPath();
    if (side === 'top') {
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + width, y, x + width, y + height, radius);
      ctx.arcTo(x + width, y + height, x, y + height, radius);
      ctx.arcTo(x, y + height, x, y, radius);
      ctx.arcTo(x, y, x + width, y, radius);
    } else if (side === 'bottom') {
      ctx.moveTo(x + radius, y + height);
      ctx.arcTo(x + width, y + height, x + width, y, radius);
      ctx.arcTo(x + width, y, x, y, radius);
      ctx.arcTo(x, y, x, y + height, radius);
      ctx.arcTo(x, y + height, x + width, y + height, radius);
    } else {
      ctx.rect(x, y, width, height);
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawTongueRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  };

  const drawTongue = (ctx, x, y, size, direction) => {
    const tongueWidth = size / 3;
    const tongueHeight = size / 8;
    const radius = 6; // Радиус закругления углов

    ctx.fillStyle = 'white'; // Цвет языка

    ctx.beginPath();

    switch (direction) {
      case 'right':
        drawTongueRect(
          ctx,
          x + size / 2 - 5,
          y + size / 4 - tongueHeight / 2,
          tongueWidth,
          tongueHeight,
          radius,
        );
        break;
      case 'left':
        drawTongueRect(
          ctx,
          x - tongueWidth + 5,
          y + size / 4 - tongueHeight / 2,
          tongueWidth,
          tongueHeight,
          radius,
        );
        break;
      case 'top':
        drawTongueRect(
          ctx,
          x + size / 4 - tongueHeight / 2,
          y - tongueWidth + 5,
          tongueHeight,
          tongueWidth,
          radius,
        );
        break;
      case 'bottom':
        drawTongueRect(
          ctx,
          x + size / 4 - tongueHeight / 2,
          y + size / 2 - 5,
          tongueHeight,
          tongueWidth,
          radius,
        );
        break;
      default:
        drawTongueRect(
          ctx,
          x + size / 2 - 5,
          y + size / 4 - tongueHeight / 2,
          tongueWidth,
          tongueHeight,
          radius,
        );
        break;
    }

    ctx.closePath();
    ctx.fill();
  };

  const drawBonusAnim = (ctx) => {
    drawBonus(
      ctx,
      bonusAnim.x,
      bonusAnim.y,
      6,
      squareSize / 2.2,
      squareSize / 2.2 - 9,
      bonusAnim.transparency,
      true,
    );
    drawBonus(
      ctx,
      bonusAnim.x,
      bonusAnim.y,
      6,
      bonusAnim.outerRadius,
      bonusAnim.innerRadius,
      bonusAnim.transparency,
      false,
    );
    bonusAnim.outerRadius += 1;
    bonusAnim.innerRadius += 1;
  };

  const drawSpike = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();

    // Создаем линейный градиент сверху вниз
    const gradient = ctx.createLinearGradient(
      cx - outerRadius,
      cy - outerRadius,
      cx - outerRadius,
      cy + outerRadius,
    );
    gradient.addColorStop(0, 'rgba(213, 55, 52, 1)'); // Цвет сверху
    gradient.addColorStop(1, 'rgba(111, 29, 27, 0.7)'); // Цвет снизу

    // Устанавливаем стиль градиента
    ctx.fillStyle = gradient;
    ctx.fill();
  };

  const drawBonus = (ctx, cx, cy, spikes, outerRadius, innerRadius, transparency, fill) => {
    var rot = (Math.PI / 2) * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.lineWidth = 5;

    if (fill) {
      ctx.fillStyle = `rgba(234, 197, 13, ${transparency})`;
      ctx.fill();
    } else {
      ctx.strokeStyle = `rgba(234, 197, 13, ${transparency})`;
      ctx.stroke();
    }

    // Добавление текста в центр звезды
    ctx.save(); // Сохраняем текущее состояние контекста

    // Настройка шрифта
    ctx.font = 'bold 25px Erica One'; // Вы можете изменить размер и тип шрифта по вашему усмотрению
    ctx.fillStyle = `rgba(33, 33, 33, ${transparency})`; // Цвет текста
    ctx.textAlign = 'center'; // Центрируем текст по горизонтали
    ctx.textBaseline = 'middle'; // Центрируем текст по вертикали

    // Отрисовка текста
    ctx.fillText(`x${bonusProfit}`, cx, cy);

    ctx.restore(); // Восстанавливаем предыдущее состояние контекста
  };

  const drawGrid = (ctx) => {
    if (!ctx) return;

    // Создаем объект для хранения клеток с шипами
    const spikesSet = new Set(spikes.map((spike) => `${spike.col},${spike.row}`));

    // Настройки для рисования
    ctx.fillStyle = '#212121'; // Цвет стандартных клеток

    // Рисуем сетку
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * (squareSize + padding);
        const y = row * (squareSize + padding);

        // Проверяем, содержит ли текущая клетка шипы
        if (spikesSet.has(`${col},${row}`)) {
          ctx.fillStyle = 'rgba(33, 33, 33, 0.3)'; // Цвет клетки с шипами
        } else {
          ctx.fillStyle = '#212121'; // Цвет стандартной клетки
        }

        ctx.beginPath();
        ctx.moveTo(x + padding, y);
        ctx.lineTo(x + squareSize - padding, y);
        ctx.arc(x + squareSize - padding, y + padding, padding, 1.5 * Math.PI, 2 * Math.PI);
        ctx.lineTo(x + squareSize, y + squareSize - padding);
        ctx.arc(x + squareSize - padding, y + squareSize - padding, padding, 0, 0.5 * Math.PI);
        ctx.lineTo(x + padding, y + squareSize);
        ctx.arc(x + padding, y + squareSize - padding, padding, 0.5 * Math.PI, Math.PI);
        ctx.lineTo(x, y + padding);
        ctx.arc(x + padding, y + padding, padding, Math.PI, 1.5 * Math.PI);
        ctx.closePath();
        ctx.fill();
      }
    }
  };

  const drawSnake = (ctx) => {
    try {
      for (let i = 0; i < snake.length; i++) {
        const x = snake[i].x;
        const y = snake[i].y;

        // Голова змейки - закругленная сторона
        if (i === 0) {
          drawRoundedRect(ctx, x, y, squareSize / 2, squareSize / 2, squareSize / 4.5, 'top');
          drawTongue(ctx, x, y, squareSize, direction);
        }
        // Хвост змейки - закругленная сторона
        else if (i === snake.length - 1) {
          drawRoundedRect(ctx, x, y, squareSize / 2, squareSize / 2, squareSize / 4.5, 'bottom');
        }
        // Средняя часть змейки
        else {
          drawRoundedRect(ctx, x, y, squareSize / 2, squareSize / 2, squareSize / 4.5, 'top');
        }

        ctx.fill();
      }
      if (direction) {
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;
        let newSnake = snake;

        if (checkBonusCollision()) {
          // Обновите состояние или выполните действия, когда бонус был съеден
          console.log('Bonus collected!');
          // Например, обновите позицию бонуса и увеличьте размер змейки
          setBonusAnim(bonus);
          let { col, row } = generateRandomColRow();
          for (let i = 0; i < spikes.length; i++) {
            if (spikes[i].col === col && spikes[i].row === row) {
              col = Math.floor(Math.random() * cols);
              row = Math.floor(Math.random() * rows);
              i = 0;
            }
          }
          setBonus({
            x: col * (squareSize + padding) + squareSize / 2,
            y: row * (squareSize + padding) + squareSize / 2,
            col: col,
            row: row,
            transparency: 1,
            outerRadius: 0,
            innerRadius: -9,
          });
          setGameScore(gameScore + 1);
        } else {
          newSnake.pop();
        }

        switch (direction) {
          case 'right':
            snakeX += 3;
            break;
          case 'left':
            snakeX -= 3;
            break;
          case 'top':
            snakeY -= 3;
            break;
          case 'bottom':
            snakeY += 3;
            break;
        }

        let newHead = {
          x: snakeX,
          y: snakeY,
        };

        newSnake.unshift(newHead);
        setSnake(newSnake);
      }
    } catch {}
  };

  const drawGame = () => {
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawGrid(ctx);

      if (bonus.outerRadius >= squareSize / 2.2) {
        bonus.outerRadius = squareSize / 2.2;
        bonus.innerRadius = squareSize / 2.2 - 9;
      } else {
        bonus.outerRadius += 2;
        bonus.innerRadius += 2;
      }
      drawBonus(
        ctx,
        bonus.x,
        bonus.y,
        6,
        bonus.outerRadius,
        bonus.innerRadius,
        bonus.transparency,
        true,
      );
      drawSnake(ctx);

      if (bonusAnim) {
        drawBonusAnim(ctx);
        bonusAnim.transparency -= 0.05;
      }

      spikes.forEach((spike) => {
        drawSpike(ctx, spike.x, spike.y, 15, spike.outerRadius, spike.innerRadius);
      });

      if (checkWallCollision() || checkSpikeCollision()) {
        dispatch(setRunningGame('GameOver'));
        return;
      }

      cancelAnimationFrame(gameId);
      const id = requestAnimationFrame(drawGame);
      setGameId(id);
    } catch {}
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.style.width = canvas.width;
    canvas.style.height = canvas.height;
    canvas.width *= 2;
    canvas.height *= 2;
    canvas.getContext('2d').scale(2, 2);
    const squareSize = Math.min(canvas.offsetWidth / cols, canvas.offsetHeight / rows) - 11;
    setSquareSize(squareSize);

    const newSnake = [];
    for (let i = 0; i < 20; i++) {
      newSnake.push({ x: squareSize - i * 3, y: squareSize / 4 });
    }
    setSnake(newSnake);

    // Определение координат для 4 шипов
    const initialSpikes = [];
    for (let i = 0; i < 6; i++) {
      const col = Math.floor(Math.random() * cols);
      const row = Math.floor(Math.random() * (rows - 1)) + 1;

      // Добавляем случайный размер для шипов
      const outerRadius = squareSize / 3 + Math.random() * 20; // Варьируем внешний радиус
      const innerRadius = outerRadius - 17; // Внутренний радиус немного меньше

      initialSpikes.push({
        x: col * (squareSize + padding) + squareSize / 2,
        y: row * (squareSize + padding) + squareSize / 2,
        outerRadius: outerRadius,
        innerRadius: innerRadius,
        col,
        row,
      });
    }
    setSpikes(initialSpikes);

    let { col, row } = generateRandomColRow();
    for (let i = 0; i < initialSpikes.length; i++) {
      if (initialSpikes[i].col === col && initialSpikes[i].row === row) {
        col = Math.floor(Math.random() * cols);
        row = Math.floor(Math.random() * rows);
        i = 0;
      }
    }

    setBonus({
      x: col * (squareSize + padding) + squareSize / 2,
      y: row * (squareSize + padding) + squareSize / 2,
      col: col,
      row: row,
      transparency: 1,
      outerRadius: squareSize / 2.2,
      innerRadius: squareSize / 2.2 - 9,
    });
  }, []);

  useEffect(() => {
    cancelAnimationFrame(gameId);
    const id = requestAnimationFrame(drawGame);
    setGameId(id);
  }, [snake, squareSize, direction, bonus]);

  useEffect(() => {}, [direction]);

  const generateRandomColRow = () => {
    const col = Math.floor(Math.random() * cols);
    const row = Math.floor(Math.random() * rows);
    return { col, row };
  };

  // Debounce function to limit how often direction changes can occur
  const debounceDirectionChange = useCallback(
    (newDirection) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(() => {
        setDirection(newDirection);
        setLastDirection(newDirection);
      }, 100); // Adjust debounce time as needed
      setDebounceTimer(timer);
    },
    [debounceTimer],
  );

  const clickLeft = () => {
    switch (lastDirection) {
      case 'right':
        debounceDirectionChange('top');
        break;
      case 'left':
        debounceDirectionChange('bottom');
        break;
      case 'top':
        debounceDirectionChange('left');
        break;
      case 'bottom':
        debounceDirectionChange('right');
        break;
      default:
        debounceDirectionChange('left');
        break;
    }
  };

  const clickRight = () => {
    switch (lastDirection) {
      case 'right':
        debounceDirectionChange('bottom');
        break;
      case 'top':
        debounceDirectionChange('right');
        break;
      case 'left':
        debounceDirectionChange('top');
        break;
      case 'bottom':
        debounceDirectionChange('left');
        break;
      default:
        debounceDirectionChange('right');
        break;
    }
  };

  return (
    <div className="snake">
      <div className="snake-container">
        <div className="game-score">
          <p className="you-score">1000</p>
          <p className="you-new-score">{gameScore}</p>
        </div>
        <canvas
          width="368px"
          height="560px"
          style={{ width: '368px', height: '560px' }}
          ref={canvasRef}
          className="game-field"></canvas>
        <div className="game-buttons">
          <button onClick={clickLeft} className="game-button left-game-button">
            Left
          </button>
          <button onClick={clickRight} className="game-button right-game-button">
            Right
          </button>
        </div>
      </div>
    </div>
  );
}

export default Snake;
