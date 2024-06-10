import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import furiganaReducer, { toggle } from "./features/furiganaSlice";
import addWordToListReducer from "./features/addWordToListSlice";
import { vocabApi } from "./services/vocabApi";
import { listsApi } from "./services/listsApi";

const furiganaMiddleware = createListenerMiddleware();

furiganaMiddleware.startListening({
  actionCreator: toggle,
  effect: (action, listenerApi) =>
    localStorage.setItem(
      "furigana",
      JSON.stringify(
        (listenerApi.getState() as RootState).furiganaReducer.value
      )
    ),
});

export const store = configureStore({
  reducer: {
    furiganaReducer,
    addWordToListReducer,
    [vocabApi.reducerPath]: vocabApi.reducer,
    [listsApi.reducerPath]: listsApi.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({})
      .concat([vocabApi.middleware, listsApi.middleware])
      .prepend(furiganaMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
