import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  text: '',
  price: 0,
  category: '',
  subCategory: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState: initialState,
  reducers: {
    searchQuery: (state, action) => {
      state.text = action.payload;
    },
    searchPrice: (state, action) => {
      state.price = action.payload;
    },
    searchCategory: (state, action) => {
      state.category = action.payload;
    },
    searchSubCategory: (state, action) => {
      state.subCategory = action.payload;
    },
    clearSearch: (state, action) => {
      state.text = initialState.text;
      state.price = initialState.price;
      state.category = initialState.category;
      state.subCategory = initialState.subCategory;
    },
  },
});

export const {
  searchQuery,
  searchPrice,
  searchCategory,
  searchSubCategory,
  clearSearch,
} = searchSlice.actions;
const reducer = searchSlice.reducer;

export default reducer;
