import { createSlice } from "@reduxjs/toolkit";

export const settlementSlice = createSlice({
  name: "settlement",
  initialState: {
    singleSettlement: {
      recordName: "",
      people: [],
      expenses: [],
    },
  },
  reducers: {
    updateSettlement: (state, action) => {
      state.singleSettlement = action.payload.value;
    },
    cleanSingleSettlement: (state) => {
      state.singleSettlement = {
        recordName: "",
        people: [],
        expenses: [],
      }
    }
  },
});

export const { updateSettlement, cleanSingleSettlement } = settlementSlice.actions;

export const selectSingleSettlement = (state) => state.settlement.singleSettlement;

export default settlementSlice.reducer;
