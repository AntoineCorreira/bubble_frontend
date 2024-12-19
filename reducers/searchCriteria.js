import { createSlice } from '@reduxjs/toolkit';

const searchCriteriaSlice = createSlice({
  name: 'searchCriteria',
  initialState: {
    city: '',            
    days: [],            
    type: '',            
    startDate: '',       
    endDate: '',         
    selectedEstablishment: null, // L'établissement est initialisé à null
    children: '',        // Ajout pour stocker les enfants sélectionnés (ID séparés par des virgules)
  },
  reducers: {
    // Met à jour tous les critères de recherche
    setSearchCriteria: (state, action) => {
      const { city, days, type, startDate, endDate, children } = action.payload;

      state.city = city || '';                  
      state.days = Array.isArray(days) ? days : [];  
      state.type = type || '';                  
      state.startDate = startDate || '';        
      state.endDate = endDate || '';            
      state.children = children || ''; // Ajout pour gérer les enfants
    },

    // Définit un établissement sélectionné
    setSelectedEstablishment: (state, action) => {
      state.selectedEstablishment = action.payload; 
    },

    // Réinitialise l'établissement sélectionné
    resetSelectedEstablishment: (state) => {
      state.selectedEstablishment = null;
    },
  },
});

// Export des actions et du reducer
export const { setSearchCriteria, setSelectedEstablishment, resetSelectedEstablishment } = searchCriteriaSlice.actions;
export default searchCriteriaSlice.reducer;

