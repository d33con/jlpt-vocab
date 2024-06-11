import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SavedList, SavedListResponse, WordType } from "../../types";

export const listsApi = createApi({
  reducerPath: "listsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
  }),
  tagTypes: ["List"],
  endpoints: (build) => ({
    getAllLists: build.query<
      {
        allLists: SavedList[];
      },
      void
    >({
      query: () => "lists/all",
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.allLists.map(({ id }) => ({
                type: "List" as const,
                id,
              })),
              "List",
            ]
          : // an error occurred, but we still want to refetch this query when "Lists" is invalidated
            ["List"],
    }),
    getMyLists: build.query<
      {
        savedLists: SavedList[];
      },
      void
    >({
      query: () => "lists",
      providesTags: (result) =>
        result
          ? [
              ...result.savedLists.map(({ id }) => ({
                type: "List" as const,
                id,
              })),
              "List",
            ]
          : ["List"],
    }),
    getSavedList: build.query<SavedListResponse, { slug: string }>({
      query: ({ slug }) => `lists/${slug}`,
      providesTags: (result, error, arg) =>
        result
          ? [
              {
                type: "List" as const,
                slug: arg.slug,
              },
              "List",
            ]
          : ["List"],
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
      WordType,
      { listId: number; word: WordType }
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
      WordType,
      { listName: string; word: WordType }
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
      { success: boolean; word: WordType },
      { listId: number; word: WordType }
    >({
      query({ listId, word }) {
        return {
          url: `lists/edit?id=${listId}`,
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(word),
        };
      },
      invalidatesTags: ["List"],
    }),
  }),
});

export const {
  useGetAllListsQuery,
  useGetMyListsQuery,
  useGetSavedListQuery,
  useDeleteListMutation,
  useAddWordToSavedListMutation,
  useAddWordToNewListMutation,
  useRenameListMutation,
  useRemoveWordFromListMutation,
} = listsApi;
