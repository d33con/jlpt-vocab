import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { WordType } from "../../types";

export const vocabApi = createApi({
  reducerPath: "vocabApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jlpt-vocab-api.vercel.app/api/words",
  }),
  endpoints: (build) => ({
    getNewWordByLevel: build.query<WordType, { level: string }>({
      query: ({ level }) => `random?level=${level}`,
    }),
  }),
});

export const { useGetNewWordByLevelQuery } = vocabApi;
