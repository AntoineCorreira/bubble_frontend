import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { 
    token: null,
    email: null,
    civility: null,
    name: null,
    firstname: null,
    address: null,
    city: null,
    zip: null,
    phone: null,
    type: null,
    children: [], // Tableau d'enfants
    _id: null, 
  },
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    login: (state, action) => {
      // Mise à jour des informations de l'utilisateur
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
      state.value.civility = action.payload.civility;
      state.value.name = action.payload.name;
      state.value.firstname = action.payload.firstname;
      state.value.address = action.payload.address;
      state.value.city = action.payload.city;
      state.value.zip = action.payload.zip;
      state.value.phone = action.payload.phone;
      state.value.type = action.payload.type;
      state.value._id = action.payload._id;

      // Mise à jour des enfants (s'il y en a)
      if (Array.isArray(action.payload.children)) {
        state.value.children = action.payload.children;
      } else {
        state.value.children = []; // Réinitialise les enfants si la réponse est incorrecte
      }
    },
    updateUser: (state, action) => {
      // Mise à jour d'une information spécifique de l'utilisateur
      state.value = { ...state.value, ...action.payload };
    },
    logout: (state) => {
      // Réinitialisation de l'état lors de la déconnexion
      state.value.token = null;
      state.value.email = null;
      state.value.civility = null;
      state.value.name = null;
      state.value.firstname = null;
      state.value.address = null;
      state.value.city = null;
      state.value.zip = null;
      state.value.phone = null;
      state.value.type = null;
      state.value.children = []; // Réinitialise la liste des enfants
      state.value._id = null;
    }
  },
});

// Export des actions
export const { login, updateUser, logout } = userSlice.actions;

// Export du reducer
export default userSlice.reducer;
