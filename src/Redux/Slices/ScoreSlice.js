import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  scoreValue: 0,
};

export const ScoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
    increment: (state, actions) => {
      state.scoreValue += actions.payload;
    },
  },
});

export const { increment } = ScoreSlice.actions;

export default ScoreSlice.reducer;
