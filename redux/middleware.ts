import { createListenerMiddleware } from "@reduxjs/toolkit";
import { toggle as toggleFurigana } from "./features/furiganaSlice";
import { toggle as toggleKanji } from "./features/showKanjiSlice";
import type { RootState } from "./store";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: toggleFurigana,
  effect: (action, listenerApi) =>
    localStorage.setItem(
      "furigana",
      JSON.stringify((listenerApi.getState() as RootState).furiganaReducer)
    ),
});

listenerMiddleware.startListening({
  actionCreator: toggleKanji,
  effect: (action, listenerApi) =>
    localStorage.setItem(
      "kanji",
      JSON.stringify((listenerApi.getState() as RootState).showKanjiReducer)
    ),
});
