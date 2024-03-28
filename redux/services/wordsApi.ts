import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { WordProps } from "../../components/Word";

export interface LevelsCounts {
  _count: {
    word: number;
  };
  level: number;
}

type WordsResponse = WordProps[];

export const wordsApi = createApi({
  reducerPath: "wordsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
  }),
  tagTypes: ["Words"],
  endpoints: (build) => ({
    getMyWords: build.query<
      {
        words: WordsResponse;
        total: number;
        levels: LevelsCounts[];
      },
      void
    >({
      query: () => "words",
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.words.map(({ id }) => ({ type: "Words", id } as const)),
              { type: "Words", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Words', id: 'LIST' }` is invalidated
            [{ type: "Words", id: "LIST" }],
    }),
    getMyFilteredWords: build.query<
      { words: WordsResponse; total: number; levels: LevelsCounts[] },
      number[]
    >({
      query: (selectedLevels) => `words?level=[${selectedLevels}]`,
      providesTags: (result, error, id) => [{ type: "Words", id: "LIST" }],
    }),
    addToMyWords: build.mutation<WordProps, WordProps>({
      query(word) {
        return {
          url: "words",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(word),
        };
      },
      invalidatesTags: ["Words"],
    }),
    removeFromMyWords: build.mutation<
      { success: boolean; word: WordProps },
      WordProps
    >({
      query(word) {
        return {
          url: `words?id=${word.id}`,
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(word),
        };
      },
      invalidatesTags: ["Words"],
    }),
  }),
});

export const {
  useGetMyWordsQuery,
  useGetMyFilteredWordsQuery,
  useRemoveFromMyWordsMutation,
  useAddToMyWordsMutation,
} = wordsApi;
