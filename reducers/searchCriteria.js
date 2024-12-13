import { createSlice } from '@reduxjs/toolkit';

const searchCriteriaSlice = createSlice({
  name: 'searchCriteria',
  initialState: {
    city: '',          // Ville vide par défaut
    days: [],          // Tableau vide pour les jours par défaut
    type: '',          // Type vide par défaut
  },
  reducers: {
    setSearchCriteria: (state, action) => {
      const { city, days, type } = action.payload;

      state.city = city || '';  // Si 'city' est undefined ou null, on met une chaîne vide
      state.days = Array.isArray(days) ? days : [];  // Vérifie si 'days' est un tableau
      state.type = type || '';  // Si 'type' est undefined ou null, on met une chaîne vide
    },
  },
});

export const { setSearchCriteria } = searchCriteriaSlice.actions;
export default searchCriteriaSlice.reducer;
