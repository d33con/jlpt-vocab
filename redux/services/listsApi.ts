import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { WordProps } from "../../components/Word";
import { LevelsCounts } from "./wordsApi";

export interface SavedListsResponse {
  id: number;
  name: string;
  dateAdded: Date;
  words: WordProps[];
}

export const listsApi = createApi({
  reducerPath: "listsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
  }),
  tagTypes: ["Lists"],
  endpoints: (build) => ({
    getMyLists: build.query<
      {
        savedLists: SavedListsResponse[];
      },
      void
    >({
      query: () => "lists",
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.savedLists.map(
                ({ id }) => ({ type: "Lists", id } as const)
              ),
              { type: "Lists", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Words', id: 'LIST' }` is invalidated
            [{ type: "Lists", id: "LIST" }],
    }),
    getSavedList: build.query<
      {
        savedList: SavedListsResponse;
      },
      { listId: string }
    >({
      query: ({ listId }) => `lists?id=${listId}`,
      providesTags: (result, error, id) => [{ type: "Lists", id: "LIST" }],
    }),
    deleteList: build.mutation<{ name: string }, number>({
      query(listId) {
        return {
          url: `lists?id=${listId}`,
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        };
      },
      invalidatesTags: (result, error, id) => [{ type: "Lists", id }],
    }),
    addWordToSavedList: build.mutation<
      WordProps,
      { listId: number; word: WordProps }
    >({
      query({ listId, word }) {
        return {
          url: "lists",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listId, word }),
        };
      },
      invalidatesTags: ["Lists"],
    }),
    addWordToNewList: build.mutation<
      WordProps,
      { listName: string; word: WordProps }
    >({
      query({ listName, word }) {
        return {
          url: "lists/new",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listName, word }),
        };
      },
      invalidatesTags: ["Lists"],
    }),
  }),
});

export const {
  useGetMyListsQuery,
  useGetSavedListQuery,
  useDeleteListMutation,
  useAddWordToSavedListMutation,
  useAddWordToNewListMutation,
} = listsApi;
