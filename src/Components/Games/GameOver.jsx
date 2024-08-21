import React, { useEffect, useRef } from 'react';
import './GameOver.css';
import { setRunningGame } from '../../Redux/Slices/GameSlice';
import { useDispatch, useSelector } from 'react-redux';

function GameOver() {
  const gameScore = useSelector((state) => state.game.gameScore);
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const angleRef = useRef(0); // Ссылка для хранения угла поворота
  const textRef = useRef(null); // Ссылка на текстовый контейнер
  const starsCount = 10;

  const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius, angle, isMainStar) => {
    let rot = (Math.PI / 2) * 3; // Начальный угол для звезды
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.save(); // Сохраняем текущее состояние контекста
    ctx.translate(cx, cy); // Перемещаем начало координат в центр звезды
    ctx.rotate(angle); // Вращаем контекст

    ctx.beginPath();
    ctx.moveTo(0, -outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = Math.cos(rot) * outerRadius;
      y = Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = Math.cos(rot) * innerRadius;
      y = Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(0, -outerRadius);
    ctx.closePath();

    if (isMainStar) {
      ctx.fillStyle = '#FFD819';
      ctx.fill();
    } else {
      ctx.lineWidth = 1;
      ctx.strokeStyle = `#FFD819`;
      ctx.stroke();
    }

    ctx.restore(); // Восстанавливаем предыдущее состояние контекста
  };

  const resizeText = () => {
    const textElement = textRef.current;
    const containerWidth = window.innerWidth;
    const textElementWidth = textElement.scrollWidth;

    // Начальный размер шрифта
    const maxFontSize = 90;
    let fontSize = maxFontSize;

    if (textElementWidth > containerWidth) {
      // Уменьшаем размер шрифта если текст слишком длинный
      fontSize = maxFontSize * (containerWidth / textElementWidth);
    }

    console.log(textElementWidth + ' ' + containerWidth);

    // Установите минимальный размер шрифта
    fontSize = Math.max(fontSize, 10);

    textElement.style.fontSize = `${fontSize}px`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = canvas.width / 2;
    canvas.style.height = canvas.height / 2;
    canvas.getContext('2d').scale(2, 2);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Очистите канвас перед рисованием
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Рисуем звезду
      for (let i = 1; i < starsCount; i++) {
        let isMainStar = false;
        let sizeCorrect = starsCount / (i + 1);
        if (i === 1) {
          isMainStar = true;
          sizeCorrect = i;
        }
        drawStar(
          ctx,
          cx,
          cy,
          40,
          Math.min(cx, cy) * 0.9 * sizeCorrect,
          Math.min(cx, cy) * 0.7 * sizeCorrect,
          angleRef.current,
          isMainStar,
        );
      }
    };

    const animate = () => {
      angleRef.current += 0.01; // Увеличиваем угол
      resizeCanvas();
      animationFrameId = requestAnimationFrame(animate);
    };

    // Инициализируем размеры канваса
    resizeCanvas();
    animate();
    resizeText();

    // Обновляем размеры канваса при изменении размера окна
    window.addEventListener('resize', resizeCanvas);

    // Убираем обработчик и останавливаем анимацию при размонтировании компонента
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="GameOver">
      <div className="GameOver-container">
        <canvas ref={canvasRef} className="GameOver-canvas"></canvas>
        <div className="overlay-text">
          <p className="text-main">Game over!</p>
          <p ref={textRef} className="text-score">
            {gameScore}
          </p>
          <p className="text-strike">-1000--</p>
        </div>
        <div className="button-block">
          <button onClick={() => dispatch(setRunningGame(''))} className="take-button">
            Получить
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameOver;
