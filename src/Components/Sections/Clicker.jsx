import React, { useRef, useEffect, useState } from 'react';
import './Section.css';

function Clicker() {
  const frontCanvasRef = useRef(null);
  const centralCanvasRef = useRef(null);
  const [numberIsDraw, setNumberDraw] = useState(false);
  const [isAnimatedStars, setAnimatedStars] = useState(false);
  const [isAnimatedNumbers, setAnimatedNumbers] = useState(false);
  const [starsAnimationID, setStarsAnimationID] = useState();
  const [numbersAnimationID, setNumbersAnimationID] = useState();

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const MaxOuterRadius = 220;
  const MaxNumbersCount = 10;
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
  const [numbers, setNumbers] = useState([]);

  useEffect(() => {
    const resizeCanvas = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    resizeCanvas();

    const centralCanvas = centralCanvasRef.current;
    centralCanvas.width = dimensions.width;
    centralCanvas.height = dimensions.height;
    const frontCanvas = frontCanvasRef.current;
    frontCanvas.width = dimensions.width;
    frontCanvas.height = dimensions.height;
    requestAnimationFrame(StarsAnimation);

    window.addEventListener('resize', resizeCanvas);

    return () => {
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
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#FFDB26';
      ctx.stroke();
      ctx.fillStyle = '#EDC70C';
      ctx.fill();
    } else {
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(82, 82, 82, ${transparency})`;
      ctx.stroke();
    }
  };

  const NumbersAnimation = () => {
    const frontCanvas = frontCanvasRef.current;
    const ctx = frontCanvas.getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    numbers.forEach((number, index) => {
      drawNumber(ctx, number.x, number.y, number.fontSize, number.alpha);
      number.fontSize += 1;
      number.alpha -= 0.01;
    });

    cancelAnimationFrame(numbersAnimationID);

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

  const clickScreen = () => {
    cancelAnimationFrame(numbersAnimationID);

    if (!isAnimatedStars) {
      setAnimatedStars(true);
      StarsAnimation(centralCanvasRef.current.getContext('2d'));
    }

    const x = Math.random() * dimensions.width;
    const y = Math.random() * dimensions.height;
    const alpha = 1;
    const fontSize = 0;
    const remove = false;
    if (numbers.length < 20) {
      setNumbers([...numbers, { x, y, fontSize, alpha, remove }]);
    } else {
      setNumbers((prevNumbers) => {
        return prevNumbers.slice(5);
      });
    }

    const id = requestAnimationFrame(NumbersAnimation);
    setNumbersAnimationID(id);
  };

  useEffect(() => {
    console.log(numbers);
  }, [numbers]);

  return (
    <div className="Clicker-container">
      <canvas onClick={clickScreen} ref={centralCanvasRef} className="central-canvas" />
      <canvas ref={frontCanvasRef} className="front-canvas" />
    </div>
  );
}

export default Clicker;
