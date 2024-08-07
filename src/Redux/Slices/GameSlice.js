import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  runningGame: 'Snake',
};

export const GameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setRunningGame: (state, actions) => {
      state.runningGame = actions.payload;
    },
  },
});

export const { setRunningGame } = GameSlice.actions;

export default GameSlice.reducer;
