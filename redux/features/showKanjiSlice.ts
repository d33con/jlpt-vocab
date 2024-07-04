import { createSlice } from "@reduxjs/toolkit";

type ShowKanjiState = {
  value: boolean;
};

const initialState = {
  value: true,
} as ShowKanjiState;

export const showKanji = createSlice({
  name: "showKanji",
  initialState,
  reducers: {
    toggle: (state) => {
      state.value = !state.value;
    },
  },
});

export const { toggle } = showKanji.actions;
export default showKanji.reducer;
