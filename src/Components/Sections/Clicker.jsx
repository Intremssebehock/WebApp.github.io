import React, { useRef, useEffect, useState } from 'react';
import './Section.css';

function Clicker() {
  const frontCanvasRef = useRef(null);
  const centralCanvasRef = useRef(null);
  const [numbersIsDrawCount, setNumbersDrawCount] = useState(0);
  const [isAnimatedStars, setAnimatedStars] = useState(false);
  const [isAnimatedNumbers, setAnimatedNumbers] = useState(false);
  const [starsAnimationID, setStarsAnimationID] = useState();
  const [numbersAnimationID, setNumbersAnimationID] = useState();

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const MaxOuterRadius = 220;
  const MaxNumbersCount = 5;
  let stars = [
    {
      cx: dimensions.width / 2,
      cy: dimensions.height / 2,
      spikes: 20,
      outerRadius: 100,
      innerRadius: 150,
      transparency: 0.5,
    },
    {
      cx: dimensions.width / 2,
      cy: dimensions.height / 2,
      spikes: 20,
      outerRadius: 120,
      innerRadius: 170,
      transparency: 0.5,
    },
    {
      cx: dimensions.width / 2,
      cy: dimensions.height / 2,
      spikes: 20,
      outerRadius: 140,
      innerRadius: 190,
      transparency: 0.5,
    },
    {
      cx: dimensions.width / 2,
      cy: dimensions.height / 2,
      spikes: 20,
      outerRadius: 160,
      innerRadius: 210,
      transparency: 0.4,
    },
    {
      cx: dimensions.width / 2,
      cy: dimensions.height / 2,
      spikes: 20,
      outerRadius: 180,
      innerRadius: 230,
      transparency: 0.3,
    },
    {
      cx: dimensions.width / 2,
      cy: dimensions.height / 2,
      spikes: 20,
      outerRadius: 200,
      innerRadius: 250,
      transparency: 0.2,
    },
    {
      cx: dimensions.width / 2,
      cy: dimensions.height / 2,
      spikes: 20,
      outerRadius: 220,
      innerRadius: 270,
      transparency: 0.1,
    },
  ];
  const [numbers, setNumbers] = useState([
    { x: 343.0709342736543, y: 187.04862429619095, fontSize: -10, alpha: 1 },
    { x: 1.8369408027639111, y: 567.250135457437, fontSize: 0, alpha: 1 },
    { x: 85.13655967078292, y: 399.7830084698819, fontSize: -40, alpha: 1 },
    { x: 234.8369408027639111, y: 367.250135457437, fontSize: -60, alpha: 1 },
    { x: 85.13655967078292, y: 399.7830084698819, fontSize: -40, alpha: 1 },
  ]);

  useEffect(() => {
    const resizeCanvas = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    resizeCanvas();

    const centralCanvas = centralCanvasRef.current;
    centralCanvas.width = dimensions.width * 2;
    centralCanvas.height = dimensions.height * 2;
    centralCanvas.style.width = dimensions.width;
    centralCanvas.style.height = dimensions.height;
    centralCanvas.getContext('2d').scale(2, 2);

    const frontCanvas = frontCanvasRef.current;
    frontCanvas.width = dimensions.width;
    frontCanvas.height = dimensions.height;

    StarsAnimation();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(starsAnimationID);
      cancelAnimationFrame(numbersAnimationID);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [window.innerWidth]);

  const StarsAnimation = () => {
    const centralCanvas = centralCanvasRef.current;
    const ctx = centralCanvas.getContext('2d');
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    drawStar(true, ctx, dimensions.width / 2, dimensions.height / 2, 20, 95, 145);

    for (let i = 0; i < stars.length; i++) {
      drawStar(
        false,
        ctx,
        stars[i].cx,
        stars[i].cy,
        stars[i].spikes,
        stars[i].outerRadius,
        stars[i].innerRadius,
        stars[i].transparency,
      );

      stars[i].outerRadius += 2;
      stars[i].innerRadius += 2.3;

      if (stars[i].outerRadius === MaxOuterRadius) {
        stars[i].outerRadius = 100;
        stars[i].innerRadius = 150;
        stars[i].transparency = 0.5;
        setAnimatedStars(false);
        cancelAnimationFrame(starsAnimationID);
        return;
      }
    }

    const id = requestAnimationFrame(() => StarsAnimation(ctx));
    setStarsAnimationID(id);
  };

  const drawStar = (isMainStar, ctx, cx, cy, spikes, outerRadius, innerRadius, transparency) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    // Если это главная звезда, сначала нарисуйте свет за звездой
    if (isMainStar) {
      // Рисование света за звездой
      const lightRadius = outerRadius * 4; // Увеличиваем радиус света
      const lightGradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, lightRadius); // Радиальный градиент
      lightGradient.addColorStop(0, 'rgba(255, 255, 0, 0.4)'); // Желтый свет в центре
      lightGradient.addColorStop(0.4, 'rgba(255, 255, 0, 0.18)'); // Желтый свет в центре
      lightGradient.addColorStop(0.8, 'rgba(255, 255, 0, 0.04)'); // Желтый свет в центре
      lightGradient.addColorStop(1, 'rgba(255, 255, 0, 0)'); // Прозрачный по краям

      ctx.beginPath();
      ctx.arc(cx, cy, lightRadius, 0, Math.PI * 2, false); // Увеличиваем радиус круга для света
      ctx.fillStyle = lightGradient;
      ctx.fill();
    }

    ctx.strokeStyle = '#000';
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

    if (isMainStar) {
      // Основной стиль звезды
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#FFDB26';
      ctx.stroke();
      ctx.fillStyle = '#EDC70C';
      ctx.fill();

      // Рисование текста
      ctx.font = 'bold 80px Erica One'; // Настроить шрифт и размер
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const gradient = ctx.createLinearGradient(cx, cy - 90, cx, cy - 2); // Градиент сверху вниз
      gradient.addColorStop(0, '#161303'); // Цвет вверху
      gradient.addColorStop(1, '#AC9318'); // Цвет внизу

      // Рисуем текст с градиентом
      ctx.fillStyle = gradient; // Устанавливаем градиент как цвет заливки
      ctx.fillText('+5', cx, cy); // Рисуем текст
    } else {
      // Стиль для второстепенных звезд
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(82, 82, 82, ${transparency})`;
      ctx.stroke();
    }
  };

  const NumbersAnimation = () => {
    const frontCanvas = frontCanvasRef.current;
    const ctxFront = frontCanvas.getContext('2d');
    ctxFront.clearRect(0, 0, ctxFront.canvas.width, ctxFront.canvas.height);
    let count = 0;
    numbers.forEach((number, index) => {
      if (number.fontSize > 0) {
        drawNumber(ctxFront, number.x, number.y, number.fontSize, number.alpha);
        number.alpha -= 0.03;
      }
      number.fontSize += 3;
      if (number.alpha <= 0) {
        count += 1;
      }
    });

    if (count >= MaxNumbersCount) {
      numbers.forEach((number, index) => {
        number.x = Math.floor(100 + Math.random() * (dimensions.width - 99 - 100));
        number.y = Math.floor(200 + Math.random() * (dimensions.height - 99 - 200));
        number.alpha = 1;
        number.fontSize = Math.floor(-50 + Math.random() * (0 + 1 - -50));
      });
      cancelAnimationFrame(numbersAnimationID);
      setAnimatedNumbers(false);
      ctxFront.clearRect(0, 0, ctxFront.canvas.width, ctxFront.canvas.height);
      return;
    }

    const id = requestAnimationFrame(NumbersAnimation);
    setNumbersAnimationID(id);
  };

  const drawNumber = (ctx, x, y, fontSize, alpha) => {
    // Настройка тени
    ctx.shadowColor = '#000'; // Цвет тени
    ctx.shadowBlur = 10; // Размытие тени
    ctx.shadowOffsetX = 3; // Смещение тени по X
    ctx.shadowOffsetY = 3; // Смещение тени по Y

    ctx.font = `${fontSize}px Erica One`; // Используйте свой шрифт здесь
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(237, 199, 12, ${alpha})`; // Цвет текста
    ctx.fillText('+5', x, y);
  };

  useEffect(() => {
    console.log(numbersAnimationID);
  }, [numbersAnimationID]);

  const clickScreen = () => {
    if (!isAnimatedStars) {
      setAnimatedStars(true);
      StarsAnimation();
    }

    if (!isAnimatedNumbers) {
      setAnimatedNumbers(true);
      NumbersAnimation();
    }
  };

  return (
    <div className="Clicker-container">
      <canvas
        style={{ width: '100vw', height: '100vh' }}
        onClick={clickScreen}
        ref={centralCanvasRef}
        className="central-canvas"
      />
      <canvas
        style={{ width: '100vw', height: '100vh' }}
        ref={frontCanvasRef}
        className="front-canvas"
      />
    </div>
  );
}

export default Clicker;
