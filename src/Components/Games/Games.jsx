import React, { useEffect } from 'react';
import './Games.css';
import { useSelector, useDispatch } from 'react-redux';
import { setRunningGame } from '../../Redux/Slices/GameSlice';
import Snake from './Snake/Snake';
import GameOver from './GameOver';
import Sapper from './Sapper/Sapper';
import Pinball from './Pinball/Pinball';

function Games() {
  const game = useSelector((state) => state.game.runningGame);
  const dispatch = useDispatch();

  const getComponentByType = (type) => {
    switch (type) {
      case 'Snake':
        return <Snake />;
      case 'Sapper':
        return <Sapper />;
      case 'GameOver':
        return <GameOver />;
      case 'Pinball':
        return <Pinball />;
      default:
        return <></>;
    }
  };

  useEffect(() => {}, [game]);

  return <div className="games">{getComponentByType(game)}</div>;
}

export default Games;
