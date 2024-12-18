import { createSlice } from '@reduxjs/toolkit';

const searchCriteriaSlice = createSlice({
  name: 'searchCriteria',
  initialState: {
    city: '',            // Ville vide par défaut
    days: [],            // Tableau vide pour les jours par défaut
    type: '',            // Type vide par défaut
    startDate: '',       // Date de début vide par défaut
    endDate: '',         // Date de fin vide par défaut
    selectedEstablishment: null, // Établissement sélectionné
  },
  reducers: {
    setSearchCriteria: (state, action) => {
      const { city, days, type, startDate, endDate } = action.payload;

      state.city = city || '';                  // Mise à jour de la ville
      state.days = Array.isArray(days) ? days : [];  // Vérifie si 'days' est un tableau
      state.type = type || '';                  // Mise à jour du type
      state.startDate = startDate || '';        // Mise à jour de la date de début
      state.endDate = endDate || '';            // Mise à jour de la date de fin
    },
    setSelectedEstablishment: (state, action) => {
      state.selectedEstablishment = action.payload; // Mettre à jour l'établissement sélectionné
    },
    resetSelectedEstablishment: (state) => {
      state.selectedEstablishment = null; // Réinitialiser l'établissement sélectionné
    },
  },
});

export const { 
  setSearchCriteria, 
  setSelectedEstablishment, 
  resetSelectedEstablishment 
} = searchCriteriaSlice.actions;

export default searchCriteriaSlice.reducer;
