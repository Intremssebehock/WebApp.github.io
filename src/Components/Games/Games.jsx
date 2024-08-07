import React from 'react';
import './Games.css';
import { useSelector, useDispatch } from 'react-redux';
import { setRunningGame } from '../../Redux/Slices/GameSlice';
import Snake from './Snake/Snake';

function Games() {
  const game = useSelector((state) => state.game.runningGame);
  const dispatch = useDispatch();

  const getComponentByType = (type) => {
    switch (type) {
      case 'Snake':
        return <Snake />;
      default:
        return <></>;
    }
  };

  return <div className="games">{getComponentByType(game)}</div>;
}

export default Games;
