import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { WordProps } from "../../components/Word";

export interface SavedList {
  id: number;
  name: string;
  dateAdded: Date;
  words: WordProps[];
  user: {
    email: string;
  };
}

export interface LevelCounts {
  _count: {
    word: number;
  };
  level: number;
}

export interface SavedListResponse {
  list: SavedList;
  levelCounts: LevelCounts[];
}

export const listsApi = createApi({
  reducerPath: "listsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
  }),
  tagTypes: ["List"],
  endpoints: (build) => ({
    getMyLists: build.query<
      {
        savedLists: SavedList[];
      },
      void
    >({
      query: () => "lists",
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.savedLists.map(({ id }) => ({
                type: "List" as const,
                id,
              })),
              "List",
            ]
          : // an error occurred, but we still want to refetch this query when "Lists" is invalidated
            ["List"],
    }),
    getSavedList: build.query<SavedListResponse, { listId: string }>({
      query: ({ listId }) => `lists?id=${listId}`,
      providesTags: (result, error, arg) => [{ type: "List", id: arg.listId }],
    }),
    renameList: build.mutation<
      { success: boolean; list: SavedList },
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
      invalidatesTags: (result, error, arg) => [
        { type: "List", id: arg.listId },
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
      invalidatesTags: (result, error, arg) => [{ type: "List", id: arg }],
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
        { type: "List", id: arg.listId },
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
      invalidatesTags: ["List"],
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
        { type: "List", id: arg.listId },
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
