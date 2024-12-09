import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 value: { 
  token : null, 
  password: null,
  email: null,
  civility: null,
  name: null,
  firstname: null,
  adress: null,
  city: null,
  zip: null,
  phone: null,
  type: null,
  children: [],
},
};

export const nomDuReducerSlice = createSlice({
 name: 'nomDuReducer',

  initialState,
 reducers: {
   login : (state, action) => {
     state.value.token = action.payload.token;
     state.value.password = action.payload.password;
     state.value.email = action.payload.email;
     state.value.civility = action.payload.civility;
     state.value.name = action.payload.name;
     state.value.firstname = action.payload.firstname;
     state.value.adress = action.payload.adress;
     state.value.city = action.payload.city;
     state.value.zip = action.payload.zip;
     state.value.phone = action.payload.phone;
     state.value.type = action.payload.type;
     state.value.children = action.payload.children;
   },
 },
});

export const { nomFonction } = nomDuReducerSlice.actions;
export default nomDuReducerSlice.reducer;