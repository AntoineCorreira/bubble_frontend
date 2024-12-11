import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        name: null,
        description: null,
        type: null,
        address: null,
        city: null,
        zip: null,
        phone: null,
        mail: null,
        image: null,
        schedules: [],
        capacity: null,
        type: null,
    }
}

export const establishmentSlice = createSlice({
  name: 'establishment',
  initialState,
  reducers: {
    choosedEstablishment: (state, action) => {
      state.value.name = action.payload.name;
      state.value.description = action.payload.descrption;
      state.value.type = action.payload.type;
      state.value.address = action.payload.address;
      state.value.city = action.payload.city;
      state.value.zip = action.payload.zip;
      state.value.phone = action.payload.phone;
      state.value.mail = action.payload.mail;
      state.value.image = action.payload.image;
      state.value.schedules = action.payload.schedules;
      state.value.capacity = action.payload.capacity;
      state.value.type = action.payload.type;
    },
  },
});

export const { choosedEstablishment } = establishmentSlice.actions;
export default establishmentSlice.reducer;
