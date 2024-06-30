import { createSlice } from "@reduxjs/toolkit";

type KanjiCharacterState = {
  kanjiCharacter: string;
};

const initialState = {
  kanjiCharacter: null,
} as KanjiCharacterState;

export const setKanjiCharacter = createSlice({
  name: "setKanjiCharacter",
  initialState,
  reducers: {
    setCharacter: (state, action: { payload: string }) => {
      state.kanjiCharacter = action.payload;
    },
  },
});

export const { setCharacter } = setKanjiCharacter.actions;
export default setKanjiCharacter.reducer;
