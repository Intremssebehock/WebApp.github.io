import React, { useRef, useEffect, useState } from 'react';
import './Section.css';

function Clicker() {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    console.log(window.innerWidth + ' / ' + window.innerHeight);
    console.log(canvas.width + ' / ' + canvas.height);

    const resizeCanvas = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [window.innerWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    // Очистка canvas перед рисованием новой звезды
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Координаты центра canvas
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    // Рисуем звезду в центре
    drawStar(ctx, centerX, centerY, 20, 30, 25);
  }, [dimensions]);

  // Рисование звезды
  const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
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
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    ctx.fillStyle = 'skyblue';
    ctx.fill();
  };

  return (
    <div className="Clicker-container">
      <canvas ref={canvasRef} className="Clicker-canvas"></canvas>
    </div>
  );
}

export default Clicker;
