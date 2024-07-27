import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPage: '/',
};

export const PageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setCurrentPage: (state, actions) => {
      state.currentPage = actions.payload;
    },
  },
});

export const { setCurrentPage } = PageSlice.actions;

export default PageSlice.reducer;
