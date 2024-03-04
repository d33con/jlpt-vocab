import { configureStore } from "@reduxjs/toolkit";
import furiganaReducer from "./features/furiganaSlice";
import { vocabApi } from "./services/vocabApi";
import { wordsApi } from "./services/wordsApi";

export const store = configureStore({
  reducer: {
    furiganaReducer,
    [vocabApi.reducerPath]: vocabApi.reducer,
    [wordsApi.reducerPath]: wordsApi.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([vocabApi.middleware, wordsApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
