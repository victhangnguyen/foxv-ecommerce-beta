import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  text: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState: initialState,
  reducers: {
    searchQuery: (state, action) => {
      state.text = action.payload;
    },
    clearSearchQuery: (state, action) => {
      state.text = '';
    },
  },
});

export const { searchQuery, clearSearchQuery } = searchSlice.actions;
const reducer = searchSlice.reducer;

export default reducer;
