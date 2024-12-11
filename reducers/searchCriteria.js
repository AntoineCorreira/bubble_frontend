import { createSlice } from '@reduxjs/toolkit';

const searchCriteriaSlice = createSlice({
  name: 'searchCriteria',
  initialState: {
    city: '',
    period: '',
    type: '',
  },
  reducers: {
    setSearchCriteria: (state, action) => {
      state.city = action.payload.city;
      state.period = action.payload.period;
      state.type = action.payload.type;
    },
  },
});

export const { setSearchCriteria } = searchCriteriaSlice.actions;
export default searchCriteriaSlice.reducer;
