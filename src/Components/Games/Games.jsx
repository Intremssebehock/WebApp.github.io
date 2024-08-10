import React, { useEffect } from 'react';
import './Games.css';
import { useSelector, useDispatch } from 'react-redux';
import { setRunningGame } from '../../Redux/Slices/GameSlice';
import Snake from './Snake/Snake';
import GameOver from './GameOver';

function Games() {
  const game = useSelector((state) => state.game.runningGame);
  const dispatch = useDispatch();

  const getComponentByType = (type) => {
    switch (type) {
      case 'Snake':
        return <Snake />;
      case 'GameOver':
        return <GameOver />;
      default:
        return <></>;
    }
  };

  useEffect(() => {
    console.log(game);
  }, [game]);

  return <div className="games">{getComponentByType(game)}</div>;
}

export default Games;
