import { createSlice } from '@reduxjs/toolkit';

const searchCriteriaSlice = createSlice({
  name: 'searchCriteria',
  initialState: {
    location: '',
    period: '',
    type: '',
  },
  reducers: {
    setSearchCriteria: (state, action) => {
      state.location = action.payload.location;
      state.period = action.payload.period;
      state.type = action.payload.type;
    },
  },
});

export const { setSearchCriteria } = searchCriteriaSlice.actions;
export default searchCriteriaSlice.reducer;
