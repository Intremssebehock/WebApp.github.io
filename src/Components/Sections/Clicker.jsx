import React, { useRef, useEffect, useState } from 'react';
import './Section.css';

function Clicker() {
  const canvasRef = useRef(null);
  const canvasWidth = 430;
  const canvasHeight = 932;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    console.log(canvas.style);

    const drawStar = (cx, cy, spikes, outerRadius, innerRadius) => {
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
      ctx.strokeStyle = '#EDC70C';
      ctx.stroke();
      ctx.fillStyle = '#B59912';
      ctx.fill();
    };

    // Рисуем несколько звезд с разными параметрами
    drawStar(canvasWidth / 2 - 50, canvasHeight / 2 - 100, 10, 60, 150);
  }, []);

  const drawNewStar = (cx, cy, spikes, outerRadius, innerRadius) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
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
    ctx.stroke();
    ctx.fillStyle = '#B59912';
  };

  return (
    <div className="Clicker-container">
      <canvas
        onClick={() => drawNewStar(canvasWidth / 2, canvasHeight / 2 - 50, 10, 90, 190)}
        height="932px"
        width="430px"
        ref={canvasRef}
        className="Clicker-canvas"></canvas>
    </div>
  );
}

export default Clicker;
