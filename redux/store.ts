import { configureStore } from "@reduxjs/toolkit";
import addWordToListReducer from "./features/addWordToListSlice";
import furiganaReducer from "./features/furiganaSlice";
import setKanjiCharacterReducer from "./features/setKanjiCharacterSlice";
import showKanjiReducer from "./features/showKanjiSlice";
import { listenerMiddleware } from "./middleware";
import { kanjiApi } from "./services/kanjiApi";
import { listsApi } from "./services/listsApi";
import { vocabApi } from "./services/vocabApi";

const localStorageFuriganaState =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("furigana") || "null")
    : null;

const localStorageKanjiState =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("kanji") || "null")
    : null;

export const store = configureStore({
  preloadedState: {
    furiganaReducer:
      localStorageFuriganaState === null
        ? { value: true }
        : localStorageFuriganaState,
    showKanjiReducer:
      localStorageKanjiState === null
        ? { value: true }
        : localStorageKanjiState,
  },
  reducer: {
    furiganaReducer,
    addWordToListReducer,
    setKanjiCharacterReducer,
    showKanjiReducer,
    [vocabApi.reducerPath]: vocabApi.reducer,
    [listsApi.reducerPath]: listsApi.reducer,
    [kanjiApi.reducerPath]: kanjiApi.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      vocabApi.middleware,
      listsApi.middleware,
      kanjiApi.middleware,
      listenerMiddleware.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
