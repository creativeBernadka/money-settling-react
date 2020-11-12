import { createSlice } from "@reduxjs/toolkit";

export const settlementSlice = createSlice({
  name: "counter",
  initialState: {
    singleSettlement: {
      recordName: "test",
      people: ["name1"],
      expenses: [{ whoPayed: "name1", forWhom: ["name1"], howMany: 234 }],
    },
  },
  reducers: {
    updateSettlement: (state, action) => {
        console.log("UPDATING")
      state.singleSettlement = action.payload.value;
    },
    incrementByTwo: (state, action) => {
      state.value += action.payload.value;
    },
  },
});

export const { updateSettlement } = settlementSlice.actions;

export const selectSingleSettlement = (state) => state.settlement.singleSettlement;

export default settlementSlice.reducer;
