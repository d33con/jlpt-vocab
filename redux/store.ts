import { configureStore } from "@reduxjs/toolkit";
import furiganaReducer from "./features/furiganaSlice";
import { vocabApi } from "./services/vocabApi";

export const store = configureStore({
  reducer: {
    furiganaReducer,
    [vocabApi.reducerPath]: vocabApi.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([vocabApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
