import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryActionCreatorResult,
  QueryDefinition,
} from "@reduxjs/toolkit/query";
import { useState } from "react";
import {
  useAddWordToSavedListMutation,
  useAddWordToNewListMutation,
  useGetMyListsQuery,
} from "../redux/services/listsApi";
import { WordProps } from "./Word";

const AddToListModal: React.FC<{
  word: WordProps;
  refetch: () => QueryActionCreatorResult<
    QueryDefinition<
      {
        level: string;
      },
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        {},
        FetchBaseQueryMeta
      >,
      never,
      WordProps,
      "vocabApi"
    >
  >;
}> = ({ word, refetch }) => {
  const [postError, setPostError] = useState("");
  const [newListName, setNewListName] = useState("");
  const { isLoading, error, data, isFetching } = useGetMyListsQuery();
  const [addWordToSavedList, { isLoading: isAdding }] =
    useAddWordToSavedListMutation();
  const [addWordToNewList, { isLoading: isAddingToNewList }] =
    useAddWordToNewListMutation();

  const handleAddWordToSavedList = async (listId: number) => {
    try {
      await addWordToSavedList({ listId, word })
        .then(() => refetch())
        .then(document.getElementById("addToListModal").close());
    } catch (error) {
      let errMsg: string;

      if ("status" in error) {
        // you can access all properties of `FetchBaseQueryError` here
        errMsg = "error" in error ? error.error : JSON.stringify(error.data);
      } else {
        // you can access all properties of `SerializedError` here
        errMsg = error.message;
      }
      setPostError(errMsg);
      // toast({
      //   title: 'An error occurred',
      //   description: "We couldn't save your post, try again!",
      //   status: 'error',
      //   duration: 2000,
      //   isClosable: true,
      // })
    }
  };

  const handleAddWordToNewList = async () => {
    try {
      await addWordToNewList({ listName: newListName, word })
        .then(() => refetch())
        .then(document.getElementById("addToListModal").close());
    } catch (error) {
      let errMsg: string;

      if ("status" in error) {
        // you can access all properties of `FetchBaseQueryError` here
        errMsg = "error" in error ? error.error : JSON.stringify(error.data);
      } else {
        // you can access all properties of `SerializedError` here
        errMsg = error.message;
      }
      setPostError(errMsg);
      // toast({
      //   title: 'An error occurred',
      //   description: "We couldn't save your post, try again!",
      //   status: 'error',
      //   duration: 2000,
      //   isClosable: true,
      // })
    }
  };

  if (postError) return <div>Sorry something went wrong: {postError}</div>;

  return (
    <dialog id="addToListModal" className="modal">
      <div className="modal-box p-6">
        <h3 className="font-bold text-lg">Add to a saved list</h3>
        <ul className="p-4">
          {data &&
            data.savedLists.map((list) => (
              <li key={list.id} className="flex justify-between">
                {list.name}
                <button
                  onClick={() => handleAddWordToSavedList(list.id)}
                  className="btn btn-neutral btn-outline btn-sm"
                >
                  Add
                </button>
              </li>
            ))}
        </ul>
        <div className="font-bold text-lg">Create a new list</div>
        <div className="flex justify-between p-4">
          <input
            type="text"
            placeholder="Enter new list name"
            className="input input-bordered input-sm w-full max-w-xs"
            value={newListName}
            onChange={(e) => setNewListName(e.currentTarget.value)}
          />
          <button
            onClick={handleAddWordToNewList}
            className="btn btn-neutral btn-outline btn-sm"
          >
            Create
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default AddToListModal;
