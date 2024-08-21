import React, { useEffect, useRef, useState } from 'react';
import './Pinball.css';
import Matter from 'matter-js';
import { useDispatch, useSelector } from 'react-redux';
import { setRunningGame, setRunningGameScore } from '../../../Redux/Slices/GameSlice';

function Pinball() {
  const [gameScore, setGameScore] = useState(1000);
  const [bonus, setBonus] = useState({});
  const [bonusAnim, setBonusAnim] = useState();
  const [gameId, setGameId] = useState();
  const [isLeftFlipperRotate, setIsleftFlipperRotate] = useState(false);

  const canvasRef = useRef(null);
  const ballRef = useRef(null);
  const engineRef = useRef(null);
  const leftFlipperRef = useRef(null);
  const rightFlipperRef = useRef(null);

  const bonusSize = 70;

  const drawBonus = (
    ctx,
    cx,
    cy,
    spikes,
    outerRadius,
    innerRadius,
    transparency,
    fill,
    bonusProfit,
  ) => {
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

  const drawBonusAnim = (ctx, bonusProfit) => {
    drawBonus(
      ctx,
      bonusAnim.x,
      bonusAnim.y,
      6,
      bonusSize / 1.7,
      bonusSize / 1.7 - 9,
      bonusAnim.transparency,
      true,
      bonusProfit,
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
      bonusProfit,
    );
    bonusAnim.outerRadius += 1;
    bonusAnim.innerRadius += 1;
    bonusAnim.transparency -= 0.05;
  };

  useEffect(() => {
    // Создание движка и сцены
    const engine = Matter.Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    // Создание холста
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Создание объектов
    const ball = Matter.Bodies.circle(canvas.width / 2, 10, 15, { restitution: 1.0 });

    const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
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
      ctx.fillStyle = '#4C4C4C'; // Цвет звезды
      ctx.fill();
    };

    // Препятствия — 9 статичных шариков
    const obstacles = [];
    const starOuterRadius = 30; // Внешний радиус звезды
    const starInnerRadius = 23; // Внутренний радиус звезды
    const obstaclePositions = [
      { x: 60, y: 80 },
      { x: canvas.width / 2, y: 120 },
      { x: canvas.width - 60, y: 80 },
      { x: canvas.width / 2 - 50, y: 232 },
      { x: canvas.width / 2 + 50, y: 232 },
      { x: 60, y: canvas.height / 2 - 50 },
      { x: canvas.width - 60, y: canvas.height / 2 - 50 },
      { x: 270, y: canvas.height / 2 + 50 },
      { x: canvas.width - 270, y: canvas.height / 2 + 50 },
    ];

    obstaclePositions.forEach((position) => {
      const obstacle = Matter.Bodies.circle(position.x, position.y, starOuterRadius, {
        isStatic: true, // Статичное препятствие
        restitution: 1.7, // Максимальная упругость для отталкивания
        render: { visible: false }, // Скрываем стандартную отрисовку
      });
      obstacles.push(obstacle);
    });

    const rightTrapezoidVertices = [
      { x: 50, y: -60 }, // Верхний левый угол
      { x: -50, y: -45 }, // Верхний правый угол
      { x: 50, y: 220 }, // Нижний правый угол
      { x: -120, y: 220 }, // Нижний левый угол
    ];

    // Создаем тело трапеции с помощью массива вершин
    const rightGround = Matter.Bodies.fromVertices(
      canvas.width - 50,
      canvas.height - 80,
      [rightTrapezoidVertices],
      {
        isStatic: true, // Если нужно, чтобы тело двигалось
        render: { fillStyle: '#141414' },
      },
    );

    const leftTrapezoidVertices = [
      { x: -50, y: -60 }, // Верхний левый угол
      { x: 50, y: -45 }, // Верхний правый угол
      { x: 120, y: 220 }, // Нижний правый угол
      { x: -50, y: 220 }, // Нижний левый угол
    ];

    // Создаем тело трапеции с помощью массива вершин
    const leftGround = Matter.Bodies.fromVertices(50, canvas.height - 80, [leftTrapezoidVertices], {
      isStatic: true, // Если нужно, чтобы тело двигалось
      render: { fillStyle: '#141414' },
    });

    // 1. Создаем прямоугольник и 2 круга для закругленных углов
    const width = 70;
    const height = 28;
    const radius = height / 2; // радиус закругления углов

    const lf_x = 90 + width / 2;
    const lf_y = 565;

    const Left_left = Matter.Bodies.circle(lf_x - width / 2, lf_y, radius, {
      isStatic: false,
      render: { fillStyle: '#FFFFFF' },
    });
    const Right_left = Matter.Bodies.circle(lf_x + width / 2, lf_y, radius, {
      isStatic: false,
      render: { fillStyle: '#FFFFFF' },
    });
    const rect_left = Matter.Bodies.rectangle(lf_x, lf_y, width, height, {
      isStatic: false,
      render: { fillStyle: '#FFFFFF' },
    });

    // 2. Создаем составное тело из прямоугольника и кругов
    const leftFlipper = Matter.Body.create({
      parts: [rect_left, Left_left, Right_left],
      restitution: 0.0, // Упругость
      frictionAir: 0, // Убираем влияние воздуха
      inertia: Infinity, // Отключаем момент инерции для предотвращения неконтролируемого вращения
      friction: 0, // Отключаем трение
      render: {
        fillStyle: '#FFFFFF',
      },
    });

    // 3. Создаем ограничение для фиксации leftFlipper в точке
    const leftFlipperConstraint = Matter.Constraint.create({
      bodyA: leftFlipper, // Тело, которое мы фиксируем
      pointA: { x: -width / 2, y: 0 }, // Левый край (смещение по X относительно центра)
      pointB: { x: lf_x - width / 2, y: lf_y }, // Координаты фиксации в мире
      length: 0, // Длина ограничения
      stiffness: 1.0, // Жёсткость
      render: {
        visible: false, // Ограничение скрыто
      },
    });

    Matter.Body.setAngle(leftFlipper, 0.5);

    const rf_x = canvas.width - 55;
    const rf_y = 565;

    const Left_right = Matter.Bodies.circle(rf_x - width / 2, rf_y, radius, {
      isStatic: false,
      render: { fillStyle: '#FFFFFF' },
    });
    const Right_right = Matter.Bodies.circle(rf_x + width / 2, rf_y, radius, {
      isStatic: false,
      render: { fillStyle: '#FFFFFF' },
    });
    const rect_right = Matter.Bodies.rectangle(rf_x, rf_y, width, height, {
      isStatic: false,
      render: { fillStyle: '#FFFFFF' },
    });

    // 2. Создаем составное тело из прямоугольника и кругов
    const rightFlipper = Matter.Body.create({
      parts: [rect_right, Left_right, Right_right],
      restitution: 0.0, // Упругость
      frictionAir: 0, // Убираем влияние воздуха
      inertia: Infinity, // Отключаем момент инерции для предотвращения неконтролируемого вращения
      friction: 0, // Отключаем трение
      render: {
        fillStyle: '#FFFFFF',
      },
    });

    // 3. Создаем ограничение для фиксации leftFlipper в точке
    const rightFlipperConstraint = Matter.Constraint.create({
      bodyA: rightFlipper, // Тело, которое мы фиксируем
      pointA: { x: width / 2, y: 0 }, // Левый край (смещение по X относительно центра)
      pointB: { x: rf_x - width / 2, y: rf_y }, // Координаты фиксации в мире
      length: 0, // Длина ограничения
      stiffness: 1.0, // Жёсткость
      render: {
        visible: false, // Ограничение скрыто
      },
    });

    Matter.Body.setAngle(rightFlipper, -0.5);

    // Создаем стены по периметру канваса
    const walls = [
      Matter.Bodies.rectangle(canvas.width / 2, -10, canvas.width, 20, {
        isStatic: true,
        render: { visible: false }, // Верхняя стена
        render: {
          fillStyle: '#FFFFFF',
        },
      }),
      Matter.Bodies.rectangle(-10, canvas.height / 2, 20, canvas.height, {
        isStatic: true,
        render: { visible: false }, // Левая стена
        render: {
          fillStyle: '#FFFFFF',
        },
      }),
      Matter.Bodies.rectangle(canvas.width + 10, canvas.height / 2, 20, canvas.height, {
        isStatic: true,
        render: { visible: false }, // Правая стена
        render: {
          fillStyle: '#FFFFFF',
        },
      }),
    ];

    // Массив для хранения предыдущих позиций мячика
    const ballTrail = [];
    const maxTrailLength = 20; // Максимальная длина хвоста

    // 4. Добавляем тело и ограничение в мир
    Matter.World.add(world, [
      ball,
      rightGround,
      leftGround,
      rightFlipper,
      rightFlipperConstraint,
      leftFlipper,
      leftFlipperConstraint, // Добавляем ограничение для фиксации
      ...walls,
      ...obstacles,
    ]);

    ballRef.current = ball;
    leftFlipperRef.current = leftFlipper;
    rightFlipperRef.current = rightFlipper;

    // Настройка рендерера
    const render = Matter.Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width: canvas.width,
        height: canvas.height,
        wireframes: false, // Использовать wireframe или нет
        background: '#fafafa', // Цвет фона
        pixelRatio: 1, // Соотношение пикселей
      },
    });

    Matter.Render.run(render);

    // Обновление сцены
    const runEngine = () => {
      if (leftFlipper.angle >= 0.5 && leftFlipper.angularVelocity > 0) {
        Matter.Body.setAngularVelocity(leftFlipper, 0);
        Matter.Body.setAngle(leftFlipper, 0.5);
      }
      if (rightFlipper.angle <= -0.5 && rightFlipper.angularVelocity < 0) {
        Matter.Body.setAngularVelocity(rightFlipper, 0);
        Matter.Body.setAngle(rightFlipper, -0.5);
      }

      ctx.lineWidth = 15; // Ширина хвоста
      ctx.strokeStyle = 'rgba(76, 76, 76, 1)'; // Цвет хвоста
      // Рисуем полоску хвоста мячика
      if (ballTrail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(ballTrail[0].x, ballTrail[0].y);

        // Соединяем линии между всеми предыдущими позициями мячика
        for (let i = 1; i < ballTrail.length; i++) {
          // Вычисляем прозрачность в зависимости от позиции в хвосте
          const alpha = i / ballTrail.length;
          ctx.strokeStyle = `rgba(76, 76, 76, ${alpha})`; // Прозрачность от 0 до 1
          ctx.lineTo(ballTrail[i].x, ballTrail[i].y);
          ctx.stroke(); // Рисуем текущий отрезок хвоста
          ctx.beginPath();
          ctx.moveTo(ballTrail[i].x, ballTrail[i].y);
        }
      }

      // Рисуем мячик
      ctx.beginPath();
      ctx.arc(ball.position.x, ball.position.y, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFF';
      ctx.fill();

      // Рисуем звезды-препятствия
      obstacles.forEach((obstacle) => {
        drawStar(
          ctx,
          obstacle.position.x,
          obstacle.position.y,
          20,
          starOuterRadius,
          starInnerRadius,
        );
      });

      // Добавляем текущую позицию мячика в хвост
      ballTrail.push({ x: ball.position.x, y: ball.position.y });

      // Ограничиваем длину хвоста
      if (ballTrail.length > maxTrailLength) {
        ballTrail.shift(); // Удаляем старые позиции
      }

      Matter.Engine.update(engine);
      requestAnimationFrame(runEngine);
    };

    runEngine();

    setBonus({
      x: canvas.width / 2,
      y: 410,
      transparency: 1,
      outerRadius: bonusSize / 1.7,
      innerRadius: bonusSize / 1.7 - 9,
      bonusProfit: 10,
    });

    // Очистка ресурсов
    return () => {
      Matter.Render.stop(render);
      Matter.World.clear(world);
      Matter.Engine.clear(engine);
    };
  }, []);

  useEffect(() => {
    cancelAnimationFrame(gameId);
    drawGame();
  }, [bonus, bonusAnim]);

  const drawGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const bonusesCoord = [
      {
        x: canvas.width / 2,
        y: 350,
        bonusProfit: 10,
      },
      {
        x: 55,
        y: 180,
        bonusProfit: 50,
      },
      {
        x: canvas.width - 55,
        y: 180,
        bonusProfit: 50,
      },
      {
        x: 150,
        y: 320,
        bonusProfit: 30,
      },
      {
        x: canvas.width - 150,
        y: 320,
        bonusProfit: 30,
      },
    ];

    if (bonusAnim) {
      if (bonusAnim.transparency <= 0) {
        const randomIndex = Math.floor(Math.random() * 5);
        setBonusAnim(null);
        const newScore = bonus.bonusProfit + gameScore;
        setGameScore(newScore);
        setBonus({
          x: bonusesCoord[randomIndex].x,
          y: bonusesCoord[randomIndex].y,
          transparency: 1,
          outerRadius: bonusSize / 1.7,
          innerRadius: bonusSize / 1.7 - 9,
          bonusProfit: bonusesCoord[randomIndex].bonusProfit,
        });
      } else {
        drawBonusAnim(ctx, 50);
      }
    } else {
      drawBonus(
        ctx,
        bonus.x,
        bonus.y,
        6,
        bonus.outerRadius,
        bonus.innerRadius,
        bonus.transparency,
        true,
        bonus.bonusProfit,
      );
    }

    if (checkBonusCollision()) {
      setBonusAnim(bonus);
    }

    const id = requestAnimationFrame(drawGame);
    setGameId(id);
  };

  const checkBonusCollision = () => {
    const ball = ballRef.current;
    const distanceX = ball.position.x - bonus.x;
    const distanceY = ball.position.y - bonus.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    return distance < bonusSize / 2;
  };

  const handleBounce = () => {
    //setBonusAnim(bonus);
    if (ballRef.current) {
      ballRef.current.position.x = 150;
    }
  };

  const handleLeftFlipper = () => {
    if (leftFlipperRef.current && leftFlipperRef.current.angularVelocity === 0) {
      Matter.Body.setAngularVelocity(leftFlipperRef.current, -0.2); // Задаем начальную угловую скорость для вращения
      setTimeout(() => {
        Matter.Body.setAngularVelocity(leftFlipperRef.current, 0.2);
      }, 100); // Время, через которое флиппер остановится (приблизительно)
    }
  };

  const handleRightFlipper = () => {
    if (rightFlipperRef.current && rightFlipperRef.current.angularVelocity === 0) {
      Matter.Body.setAngularVelocity(rightFlipperRef.current, 0.2); // Задаем начальную угловую скорость для вращения
      setTimeout(() => {
        Matter.Body.setAngularVelocity(rightFlipperRef.current, -0.2);
      }, 100); // Время, через которое флиппер остановится (приблизительно)
    }
  };

  return (
    <div className="Pinball">
      <div className="Pinball-container">
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
        <canvas width="372px" height="771px" ref={canvasRef} className="canvas"></canvas>
        <div className="game-buttons">
          <button onClick={handleLeftFlipper} className="flipper-button"></button>
          <button onClick={handleRightFlipper} className="flipper-button"></button>
        </div>
      </div>
    </div>
  );
}

export default Pinball;
