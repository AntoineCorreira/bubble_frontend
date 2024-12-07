import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 value: [],
};

export const nomDuReducerSlice = createSlice({
 name: 'nomDuReducer',

  initialState,
 reducers: {
   nomFonction : (state, action) => {
     state.value.push(action.payload);
   },
 },
});

export const { nomFonction } = nomDuReducerSlice.actions;
export default nomDuReducerSlice.reducer;