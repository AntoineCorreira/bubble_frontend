import { createSlice } from '@reduxjs/toolkit';

const initialState = {
 value: { 
  token : null, 
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
     state.value.token = action.payload.token,
     state.value.email = action.payload.email,
     state.value.civility = action.payload.civility,
     state.value.name = action.payload.name,
     state.value.firstname = action.payload.firstname,
     state.value.adress = action.payload.adress,
     state.value.city = action.payload.city,
     state.value.zip = action.payload.zip,
     state.value.phone = action.payload.phone,
     state.value.type = action.payload.type,
     state.value.children = action.payload.children
   },
   logout : (state) =>{
    state.value.token = null;
     state.value.email = null;
     state.value.civility = null;
     state.value.name = null;
     state.value.firstname = null;
     state.value.adress = null;
     state.value.city = null;
     state.value.zip = null;
     state.value.phone = null;
     state.value.type = null;
     state.value.children = null;
   }
 },
});

export const { nomFonction, login, lougout } = nomDuReducerSlice.actions;
export default nomDuReducerSlice.reducer;