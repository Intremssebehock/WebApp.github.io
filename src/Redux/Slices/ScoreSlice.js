import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  score: 0,
};

export const ScoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
    increment: (state) => {
      state.score += 1;
    },
  },
});

export const { increment } = ScoreSlice.actions;

export default ScoreSlice.reducer;
