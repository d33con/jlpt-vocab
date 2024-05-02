import { createSlice } from "@reduxjs/toolkit";
import { WordType } from "../../types";

type AddWordState = {
  word: WordType | null;
};

const initialState = {
  word: null,
} as AddWordState;

export const addWordToList = createSlice({
  name: "addWordToList",
  initialState,
  reducers: {
    setWord: (state, action: { payload: WordType }) => {
      state.word = action.payload;
    },
  },
});

export const { setWord } = addWordToList.actions;
export default addWordToList.reducer;
