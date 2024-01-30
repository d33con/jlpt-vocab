import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { WordProps } from "../../components/Word";

export const vocabApi = createApi({
  reducerPath: "vocabApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jlpt-vocab-api.vercel.app/api/words",
  }),
  endpoints: (builder) => ({
    getNewWordByLevel: builder.query<WordProps, { level: string }>({
      query: ({ level }) => `random?level=${level}`,
    }),
  }),
});

export const { useGetNewWordByLevelQuery } = vocabApi;
