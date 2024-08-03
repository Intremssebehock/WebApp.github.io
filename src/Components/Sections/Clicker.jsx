import React, { useRef, useEffect, useState } from 'react';
import './Section.css';
import { useSelector, useDispatch } from 'react-redux';
import { increment } from '../../Redux/Slices/ScoreSlice';
import Hires from '../Hires/Hires';
import Abilities from '../Abilities/Abilities';

function Clicker() {
  const score = useSelector((state) => state.score.scoreValue);
  const dispatch = useDispatch();
  const totalScoreRef = useRef(null);
  const frontCanvasRef = useRef(null);
  const centralCanvasRef = useRef(null);
  const backCanvasRef = useRef(null);
  const [isAnimatedStars, setAnimatedStars] = useState(false);
  const [isAnimatedNumbers, setAnimatedNumbers] = useState(false);
  const [isAnimatedMainButton, setAnimatedMainButton] = useState(false);
  const [starsAnimationID, setStarsAnimationID] = useState();
  const [numbersAnimationID, setNumbersAnimationID] = useState();
  const [mainButtonAnimationID, setMainButtonAnimationID] = useState();
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [mainStar, setMainStar] = useState({
    cx: dimensions.width / 2,
    cy: dimensions.height / 2 + dimensions.height / 10,
    spikes: 20,
    outerRadius: 90,
    innerRadius: 140,
    transparency: 1,
    brightness: 0,
    standardOuterRadius: 90,
    standardInnerRadius: 140,
  });

  const [globalTransparencyDecrement, setGlobalTransparencyDecrement] = useState();
  const [maxOuterRadius, setMaxOuterRadius] = useState(300);
  const [ratio, setRatio] = useState(30);
  const [maxNumbersCount, setMaxNumbersCount] = useState(5);
  const [stars, setStars] = useState([]); // Состояние для массива звёзд
  const [numbers, setNumbers] = useState([
    { x: 343, y: 187, fontSize: -10, alpha: 1, isBackground: false },
    { x: 142, y: 267, fontSize: 0, alpha: 1, isBackground: false },
    { x: 85, y: 399, fontSize: -40, alpha: 1, isBackground: true },
    { x: 234, y: 367, fontSize: -60, alpha: 1, isBackground: false },
    { x: 85, y: 399, fontSize: -40, alpha: 1, isBackground: true },
  ]);

  const generateStars = (starCount, outerRadiusIncrement, innerRadiusIncrement) => {
    const baseStar = { ...mainStar };
    const transparencyDecrement = (10 / starCount) * 0.1;
    setGlobalTransparencyDecrement(transparencyDecrement);

    let generatedStars = [];
    for (let i = 0; i < starCount; i++) {
      const outerRadius = baseStar.outerRadius + i * outerRadiusIncrement;
      const innerRadius = baseStar.innerRadius + i * innerRadiusIncrement;
      const transparency = 1 - transparencyDecrement * i;

      generatedStars.push({
        cx: baseStar.cx,
        cy: baseStar.cy,
        spikes: baseStar.spikes,
        outerRadius,
        innerRadius,
        transparency,
      });
    }
    setMaxOuterRadius(generatedStars[starCount - 1].outerRadius + ratio);

    setStars(generatedStars); // Обновляем состояние звёзд
  };

  useEffect(() => {
    const resizeCanvas = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    resizeCanvas();
    generateStars(15, 30, 30);
    const centralCanvas = centralCanvasRef.current;
    centralCanvas.width = dimensions.width * 2;
    centralCanvas.height = dimensions.height * 2;
    centralCanvas.style.width = dimensions.width;
    centralCanvas.style.height = dimensions.height;
    centralCanvas.getContext('2d').scale(2, 2);

    const frontCanvas = frontCanvasRef.current;
    frontCanvas.width = dimensions.width;
    frontCanvas.height = dimensions.height;

    const backCanvas = backCanvasRef.current;
    backCanvas.width = dimensions.width;
    backCanvas.height = dimensions.height;

    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(starsAnimationID);
      cancelAnimationFrame(numbersAnimationID);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [window.innerWidth, window.innerHeight]);

  useEffect(() => {
    StarsAnimation();
  }, [stars]);

  useEffect(() => {
    switch (true) {
      case score >= 1000000:
        totalScoreRef.current.style.fontSize = '60px';
        break;
      case score >= 100000:
        totalScoreRef.current.style.fontSize = '70px';
        break;
      case score >= 10000:
        totalScoreRef.current.style.fontSize = '80px';
        break;
      case score >= 1000:
        totalScoreRef.current.style.fontSize = '110px';
        break;
      default:
        totalScoreRef.current.style.fontSize = '150px';
        break;
    }
  }, [score]);

  const StarsAnimation = () => {
    try {
      if (stars.length === 0) {
        return;
      }
      let continueAnim = true;
      let isCenterAnim = false;
      const centralCanvas = centralCanvasRef.current;
      const ctx = centralCanvas.getContext('2d');
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

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

        if (stars[i].outerRadius >= maxOuterRadius - ratio / 2) {
          isCenterAnim = true;
        }

        if (stars[i].outerRadius >= maxOuterRadius) {
          stars[i].outerRadius = mainStar.outerRadius + 10;
          stars[i].innerRadius = mainStar.innerRadius + 10;
          stars[i].transparency = 1;
          continueAnim = false;
        } else {
          stars[i].outerRadius += 2;
          stars[i].innerRadius += 2.3;
          stars[i].transparency -= globalTransparencyDecrement * 0.1;
        }
      }

      if (isCenterAnim === false) {
        drawStar(
          true,
          ctx,
          mainStar.cx,
          mainStar.cy,
          mainStar.spikes,
          mainStar.outerRadius,
          mainStar.innerRadius,
          1,
          mainStar.outerRadius - 10,
          mainStar.brightness,
        );
        mainStar.outerRadius -= 0.5;
        mainStar.innerRadius -= 1;
        mainStar.brightness += 0.01;
      } else {
        drawStar(
          true,
          ctx,
          mainStar.cx,
          mainStar.cy,
          mainStar.spikes,
          mainStar.outerRadius,
          mainStar.innerRadius,
          1,
          mainStar.outerRadius - 10,
          mainStar.brightness,
        );
        if (mainStar.outerRadius >= mainStar.standardOuterRadius) {
          mainStar.outerRadius = mainStar.standardOuterRadius;
          mainStar.innerRadius = mainStar.standardInnerRadius;
          mainStar.brightness = 0;
        } else {
          mainStar.outerRadius += 0.5;
          mainStar.innerRadius += 1;
          mainStar.brightness -= 0.01;
        }
      }

      if (continueAnim) {
        cancelAnimationFrame(starsAnimationID);
        const id = requestAnimationFrame(StarsAnimation);
        setStarsAnimationID(id);
      } else {
        setAnimatedStars(false);
        cancelAnimationFrame(starsAnimationID);
        return;
      }
    } catch {}
  };

  const drawStar = (
    isMainStar,
    ctx,
    cx,
    cy,
    spikes,
    outerRadius,
    innerRadius,
    transparency = 1,
    fontSizeNumber = 80,
    brightness = 0,
  ) => {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    // Если это главная звезда, сначала нарисуйте свет за звездой
    if (isMainStar) {
      // Рисование света за звездой
      const lightRadius = outerRadius * 4; // Увеличиваем радиус света
      const lightGradient = ctx.createRadialGradient(cx, cy - 80, 110, cx, cy, lightRadius); // Радиальный градиент
      lightGradient.addColorStop(0, `rgba(181, 153, 18, ${0.39 + brightness})`); // Желтый свет в центре
      lightGradient.addColorStop(0.4, `rgba(181, 153, 18, ${0.2 + brightness})`); // Желтый свет в центре
      lightGradient.addColorStop(0.8, `rgba(181, 153, 18, ${0.04 + brightness})`); // Желтый свет в центре
      lightGradient.addColorStop(1, `rgba(181, 153, 18, 0)`); // Прозрачный по краям

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
      const gradientStar = ctx.createLinearGradient(cx, cy - 50, cx, cy + 70); // Градиент сверху вниз
      gradientStar.addColorStop(0, '#edc70c'); // Цвет вверху
      gradientStar.addColorStop(1, '#b59912'); // Цвет внизу

      ctx.lineWidth = 7;
      ctx.strokeStyle = '#FFDB26';
      ctx.stroke();
      ctx.fillStyle = gradientStar;
      ctx.fill();

      // Рисование текста
      ctx.font = `bold ${fontSizeNumber}px Erica One`; // Настроить шрифт и размер
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const gradientText = ctx.createLinearGradient(cx, cy - 95, cx, cy - 10); // Градиент сверху вниз
      gradientText.addColorStop(0, '#161303'); // Цвет вверху
      gradientText.addColorStop(1, '#AC9318'); // Цвет внизу

      // Рисуем текст с градиентом
      ctx.fillStyle = gradientText; // Устанавливаем градиент как цвет заливки
      ctx.fillText('+5', cx, cy); // Рисуем текст
    } else {
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(204, 172, 16, ${transparency})`;
      ctx.stroke();
    }
  };

  const NumbersAnimation = () => {
    try {
      const frontCanvas = frontCanvasRef.current;
      const ctxFront = frontCanvas.getContext('2d');
      const backCanvas = backCanvasRef.current;
      const ctxBack = backCanvas.getContext('2d');
      ctxFront.clearRect(0, 0, ctxFront.canvas.width, ctxFront.canvas.height);
      ctxBack.clearRect(0, 0, ctxFront.canvas.width, ctxFront.canvas.height);
      let count = 0;
      numbers.forEach((number, index) => {
        if (number.fontSize > 0) {
          if (number.isBackground) {
            drawNumber(
              ctxBack,
              number.x,
              number.y,
              number.fontSize,
              number.alpha,
              number.isBackground,
            );
          } else {
            drawNumber(
              ctxFront,
              number.x,
              number.y,
              number.fontSize,
              number.alpha,
              number.isBackground,
            );
          }
          number.alpha -= globalTransparencyDecrement / 4;
        }
        number.fontSize += 2;
        if (number.alpha <= 0) {
          count += 1;
        }
      });

      if (count >= maxNumbersCount) {
        numbers.forEach((number, index) => {
          number.x = Math.random() * dimensions.width;
          number.y = Math.random() * dimensions.height;
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
    } catch {}
  };

  const drawNumber = (ctx, x, y, fontSize, alpha, isBackground) => {
    // Настройка тени
    if (!isBackground) {
      ctx.shadowColor = '#000'; // Цвет тени
      ctx.shadowBlur = 10; // Размытие тени
      ctx.shadowOffsetX = 3; // Смещение тени по X
      ctx.shadowOffsetY = 3; // Смещение тени по Y
    }

    ctx.font = `${fontSize}px Erica One`; // Используйте свой шрифт здесь
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (isBackground) {
      ctx.fillStyle = `rgba(76, 66, 16, ${alpha})`; // Цвет текста
    } else {
      ctx.fillStyle = `rgba(237, 199, 12, ${alpha})`; // Цвет текста
    }
    ctx.fillText('+5', x, y);
  };

  const updateScore = () => {
    dispatch(increment(5));
  };

  const clickScreen = () => {
    updateScore();

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
      <div className="upgrades">
        <Hires />
        <Abilities />
      </div>
      <p ref={totalScoreRef} className="total-score">
        {score}°
      </p>
      <canvas
        style={{ width: '100vw', height: '100vh' }}
        ref={backCanvasRef}
        className="back-canvas"
      />
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
