import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { KanjiType } from "../../types";

export const kanjiApi = createApi({
  reducerPath: "kanjiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://kanjiapi.dev/v1/kanji/",
  }),
  endpoints: (build) => ({
    getKanjiDetails: build.query<KanjiType, { kanji: string }>({
      query: ({ kanji }) => `${kanji}`,
    }),
  }),
});

export const { useGetKanjiDetailsQuery } = kanjiApi;
