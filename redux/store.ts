import { configureStore } from "@reduxjs/toolkit";
import furiganaReducer from "./features/furiganaSlice";
import addWordToListReducer from "./features/addWordToListSlice";
import setKanjiCharacterReducer from "./features/setKanjiCharacterSlice";
import { vocabApi } from "./services/vocabApi";
import { listsApi } from "./services/listsApi";
import { kanjiApi } from "./services/kanjiApi";

export const store = configureStore({
  reducer: {
    furiganaReducer,
    addWordToListReducer,
    setKanjiCharacterReducer,
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
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
