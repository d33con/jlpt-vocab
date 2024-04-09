import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { WordProps } from "../../components/Word";
import { LevelsCounts } from "./wordsApi";

export interface SavedListsResponse {
  id: number;
  name: string;
  dateAdded: Date;
  words: WordProps[];
}

export interface LevelCounts {
  _count: {
    word: number;
  };
  level: number;
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
        list: SavedListsResponse;
        levelCounts: LevelCounts[];
      },
      { listId: string }
    >({
      query: ({ listId }) => `lists?id=${listId}`,
      providesTags: (result, error, id) => [{ type: "Lists", id: id.listId }],
    }),
    renameList: build.mutation<
      { success: boolean; list: SavedListsResponse },
      { listId: number; newName: string }
    >({
      query({ listId, newName }) {
        return {
          url: `lists?id=${listId}`,
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newName),
        };
      },
      invalidatesTags: (result, error, id) => [
        { type: "Lists", id: id.listId },
      ],
    }),
    deleteList: build.mutation<{ success: Boolean; name: string }, number>({
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
          url: `lists?id=${listId}`,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(word),
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Lists", id: arg.listId },
      ],
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
      invalidatesTags: (result, error, arg) => [
        { type: "Lists", name: arg.listName },
      ],
    }),
    removeWordFromList: build.mutation<
      { success: boolean; word: WordProps },
      { listId: number; word: WordProps }
    >({
      query({ listId, word }) {
        return {
          url: `lists/edit?id=${listId}`,
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(word),
        };
      },
      invalidatesTags: (result, error, arg) => [
        { type: "Lists", id: arg.listId },
      ],
    }),
  }),
});

export const {
  useGetMyListsQuery,
  useGetSavedListQuery,
  useDeleteListMutation,
  useAddWordToSavedListMutation,
  useAddWordToNewListMutation,
  useRenameListMutation,
  useRemoveWordFromListMutation,
} = listsApi;
