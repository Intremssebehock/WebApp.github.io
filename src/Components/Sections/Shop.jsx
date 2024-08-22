import React, { useState } from 'react';
import Games from '../Games/Games';
import { useDispatch } from 'react-redux';
import { setRunningGame } from '../../Redux/Slices/GameSlice';
import SnakePreview from './../../images/SnakePreview.jpg';
import SapperPreview from './../../images/SapperPreview.jpg';
import TickTackToePreview from './../../images/TickTackToePreview.jpg';
import PinballPreview from './../../images/PinballPreview.jpg';

function Shop() {
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState('auto'); // Изначально выбран раздел "Auto"
  const [games, setGames] = useState([
    { name: 'Snake', price: 'Бесплатно', img: SnakePreview },
    { name: 'Sapper', price: 'Бесплатно', img: SapperPreview },
    { name: 'TickTackToe', price: 'Бесплатно', img: TickTackToePreview },
    { name: 'Pinball', price: 'Бесплатно', img: PinballPreview },
  ]);

  // Функция для переключения разделов
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="store-container">
      <h1 className="store-title">Improve</h1>
      <div className="store-buttons">
        <button
          className={`store-button ${activeSection === 'auto' ? 'active' : ''}`}
          onClick={() => handleSectionChange('auto')}>
          +Auto
        </button>
        <button
          className={`store-button ${activeSection === 'click' ? 'active' : ''}`}
          onClick={() => handleSectionChange('click')}>
          +Click
        </button>
        <button
          className={`store-button ${activeSection === 'games' ? 'active' : ''}`}
          onClick={() => handleSectionChange('games')}>
          +Game
        </button>
      </div>
      <div className="store-content">
        {activeSection === 'auto' && (
          <div className="store-section">
            <p className="section-title">Labor exchange</p>
            <p className="section-description">
              Нанимайте работников, которые будут кликать за вас и приносить автоматический доход
            </p>
          </div>
        )}
        {activeSection === 'click' && (
          <div className="store-section">
            <p className="section-title">Finger Swing</p>
            <p className="section-description">
              Делайте упражнения на пальцы и получайте больше от одного касания{' '}
            </p>
          </div>
        )}
        {activeSection === 'games' && (
          <div className="store-section">
            <p className="section-title">Mini-games</p>
            <p className="section-description">
              Покупайте новые мини-игры и получайте больше иксов. Игры часто появляются в пузырях,
              когда вы кликаете монету
            </p>
            <ul className="game-list">
              {games.map((game, index) => (
                <li key={index} className="game-list-item">
                  <div className="game-container">
                    <div className="game-info">
                      <p className="title">{game.name}</p>
                      <p className="price">{game.price}</p>
                    </div>
                    <img className="game-preview" src={game.img} alt="GamePreview" />
                  </div>
                  <button onClick={() => dispatch(setRunningGame(game.name))} className="receive">
                    Играть
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <Games />
    </div>
  );
}

export default Shop;
