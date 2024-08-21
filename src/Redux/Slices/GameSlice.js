import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  runningGame: 'Pinball',
  gameScore: 0,
};

export const GameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setRunningGame: (state, actions) => {
      state.runningGame = actions.payload;
    },
    setRunningGameScore: (state, actions) => {
      state.gameScore = actions.payload;
    },
  },
});

export const { setRunningGame, setRunningGameScore } = GameSlice.actions;

export default GameSlice.reducer;
