import { configureStore } from "@reduxjs/toolkit";
import furiganaReducer from "./features/furiganaSlice";
import wordstestReducer from "./features/wordsTestSlice";
import addWordToListReducer from "./features/addWordToListSlice";
import { vocabApi } from "./services/vocabApi";
import { wordsApi } from "./services/wordsApi";
import { listsApi } from "./services/listsApi";

export const store = configureStore({
  reducer: {
    furiganaReducer,
    wordstestReducer,
    addWordToListReducer,
    [vocabApi.reducerPath]: vocabApi.reducer,
    [wordsApi.reducerPath]: wordsApi.reducer,
    [listsApi.reducerPath]: listsApi.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([
      vocabApi.middleware,
      wordsApi.middleware,
      listsApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
