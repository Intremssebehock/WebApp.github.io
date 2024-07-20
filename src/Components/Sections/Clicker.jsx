import React, { useRef, useEffect, useState } from 'react';
import './Section.css';

function Clicker() {
  const canvasRef = useRef(null);
  const [numberIsDraw, setNumberDraw] = useState(false);
  const [isAnimated, setAnimated] = useState(false);
  const [animationID, setAnimationID] = useState();
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const MaxOuterRadius = 220;
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

  useEffect(() => {
    const resizeCanvas = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    resizeCanvas();

    const canvas = canvasRef.current;
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    Animation(canvasRef.current.getContext('2d'));

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [window.innerWidth]);

  const Animation = (ctx) => {
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    drawStar(true, ctx, dimensions.width / 2, dimensions.height / 2, 20, 95, 145);
    if (numberIsDraw === true) {
      setNumberDraw(true);
    } else {
      drawRandomNumberWithShadow(canvasRef.current.getContext('2d'), canvasRef.current);
      setNumberDraw(true);
    }

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
        StopAnimation();
        return;
      }
    }

    const id = requestAnimationFrame(() => Animation(ctx));
    setAnimationID(id);
  };

  const StopAnimation = () => {
    setAnimated(false);
    cancelAnimationFrame(animationID);
  };

  const StartAnimation = () => {
    setAnimated(true);
    Animation(canvasRef.current.getContext('2d'));
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

  const drawRandomNumberWithShadow = (ctx, canvas) => {
    // Получаем случайную точку на canvas
    const x = 100;
    const y = 100;

    // Устанавливаем тень
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;

    // Устанавливаем стиль текста
    ctx.fillStyle = 'white'; // Цвет текста
    ctx.font = '32px Arial'; // Размер и шрифт текста

    // Рисуем цифру "1"
    ctx.fillText('1', x, y);

    // Сбрасываем тень после рисования
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };

  return (
    <div className="Clicker-container">
      <canvas
        onClick={() => (isAnimated ? '' : StartAnimation())}
        ref={canvasRef}
        className="Clicker-canvas"></canvas>
    </div>
  );
}

export default Clicker;
