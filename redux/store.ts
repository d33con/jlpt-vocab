import { configureStore } from "@reduxjs/toolkit";
import furiganaReducer from "./features/furiganaSlice";
import addWordToListReducer from "./features/addWordToListSlice";
import { vocabApi } from "./services/vocabApi";
import { listsApi } from "./services/listsApi";

export const store = configureStore({
  reducer: {
    furiganaReducer,
    addWordToListReducer,
    [vocabApi.reducerPath]: vocabApi.reducer,
    [listsApi.reducerPath]: listsApi.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([vocabApi.middleware, listsApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
