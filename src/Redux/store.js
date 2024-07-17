import { configureStore } from '@reduxjs/toolkit';
import scoreReducer from './Slices/ScoreSlice';

export const store = configureStore({
  reducer: { score: scoreReducer },
});
