import React, { useRef, useEffect, useState } from 'react';
import './Section.css';

function Clicker() {
  const frontCanvasRef = useRef(null);
  const centralCanvasRef = useRef(null);
  const [numberIsDraw, setNumberDraw] = useState(false);
  const [isAnimated, setAnimated] = useState(false);
  const [StarsanimationID, setStarsAnimationID] = useState();
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
    requestAnimationFrame(() => StarsAnimation(centralCanvas.getContext('2d')));

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [window.innerWidth]);

  const StarsAnimation = (ctx) => {
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
        setAnimated(false);
        cancelAnimationFrame(StarsanimationID);
        return;
      }
    }

    const id = requestAnimationFrame(() => StarsAnimation(ctx));
    setStarsAnimationID(id);
  };

  const NumbersAnimation = (x, y) => {
    const frontCanvas = frontCanvasRef.current;
    const ctx = frontCanvas.getContext('2d');

    const duration = 500; // Продолжительность анимации в миллисекундах
    const startTime = performance.now();
    const maxScale = 2;

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const scale = 1 + maxScale * Math.sin(progress * Math.PI); // Увеличение и уменьшение
      const alpha = 1 - progress;

      drawNumber(ctx, x, y, scale, alpha);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setNumberDraw(false);
      }
    };

    if (!numberIsDraw) {
      setNumberDraw(true);
      requestAnimationFrame(animate);
    } else {
      // Если уже идет анимация, добавляем новое событие в очередь
      setNumbers([...numbers, { x, y }]);
    }
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

  const drawNumber = (ctx, x, y, scale, alpha) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalAlpha = alpha;
    ctx.font = `${scale * 50}px Erica One`; // Размер шрифта меняется в зависимости от масштаба
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#EDC70C';
    ctx.fillText('+5', x, y);
  };

  const clickScreen = () => {
    if (!isAnimated) {
      setAnimated(true);
      StarsAnimation(centralCanvasRef.current.getContext('2d'));
    }

    const x = Math.random() * dimensions.width;
    const y = Math.random() * dimensions.height;
    NumbersAnimation(x, y);
    setNumbers([...numbers, { x, y }]);
  };

  return (
    <div className="Clicker-container">
      <canvas onClick={clickScreen} ref={centralCanvasRef} className="central-canvas" />
      <canvas ref={frontCanvasRef} className="front-canvas" />
    </div>
  );
}

export default Clicker;
