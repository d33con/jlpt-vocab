import { createSlice } from "@reduxjs/toolkit";
import { WordProps } from "../../components/Word";

type AddWordState = {
  word: WordProps | null;
};

const initialState = {
  word: null,
} as AddWordState;

export const addWordToList = createSlice({
  name: "addWordToList",
  initialState,
  reducers: {
    setWord: (state, action: { payload: WordProps }) => {
      state.word = action.payload;
    },
  },
});

export const { setWord } = addWordToList.actions;
export default addWordToList.reducer;
