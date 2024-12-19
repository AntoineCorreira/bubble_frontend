import { createSlice } from '@reduxjs/toolkit';

const searchCriteriaSlice = createSlice({
  name: 'searchCriteria',
  initialState: {
    city: '',            // Ville vide par défaut
    days: [],            // Tableau vide pour les jours par défaut
    type: '',            // Type vide par défaut
    startDate: '',       // Date de début vide par défaut
    endDate: '',         // Date de fin vide par défaut
    children: [],
    selectedEstablishment: null, // Établissement sélectionné
  },
  reducers: {
    // Met à jour tous les critères de recherche
    setSearchCriteria: (state, action) => {
      const { city, days, type, startDate, endDate, children } = action.payload;

      state.city = city || '';                  // Mise à jour de la ville
      state.days = Array.isArray(days) ? days : [];  // Vérifie si 'days' est un tableau
      state.type = type || '';                  // Mise à jour du type
      state.startDate = startDate || '';        // Mise à jour de la date de début
      state.endDate = endDate || '';            // Mise à jour de la date de fin
      // Ajouter les enfants tout en éliminant les doublons
      const allChildren = [...state.children, ...children];
      state.children = allChildren.filter((child, index, self) =>
        index === self.findIndex((c) => c.id === child.id) // Assurez-vous d'avoir un identifiant unique pour chaque enfant
      );
    },
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

