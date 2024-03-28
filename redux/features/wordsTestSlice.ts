import { createSlice } from "@reduxjs/toolkit";
import { WordProps } from "../../components/Word";

type WordsTestState = {
  words: WordProps[];
};

const initialState = {
  words: [],
} as WordsTestState;

export const wordstest = createSlice({
  name: "wordstest",
  initialState,
  reducers: {
    toggle: (state) => {
      state.value = !state.value;
    },
  },
});

export const { toggle } = wordstest.actions;
export default wordstest.reducer;
