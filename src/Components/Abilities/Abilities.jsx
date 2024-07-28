import React from 'react';
import './Abilities.css';
import dogiImg from './../../images/Dogi.jpg';

function Abilities() {
  return (
    <div className="hires">
      <div className="hires-container">
        <div className="top-part">
          <ul className="hires-avatars-list">
            <li>
              <img className="hires-avatar" src={dogiImg} alt="hires" />
            </li>
            <li>
              <img className="hires-avatar" src={dogiImg} alt="hires" />
            </li>
            <li>
              <img className="hires-avatar" src={dogiImg} alt="hires" />
            </li>
          </ul>
          <p className="hires-number">3 нанято</p>
        </div>
        <div className="bottom-part">
          <p>320</p>
          <div className="star"></div>
          <p>в минуту</p>
        </div>
      </div>
    </div>
  );
}

export default Abilities;
