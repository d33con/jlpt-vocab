import { createSlice } from "@reduxjs/toolkit";

type FuriganaState = {
  value: boolean;
};

const initialState = {
  value: null,
} as FuriganaState;

export const furigana = createSlice({
  name: "furigana",
  initialState,
  reducers: {
    toggle: (state) => {
      state.value = !state.value;
    },
  },
});

export const { toggle } = furigana.actions;
export default furigana.reducer;
