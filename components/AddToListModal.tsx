import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryActionCreatorResult,
  QueryDefinition,
} from "@reduxjs/toolkit/query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import {
  useAddWordToNewListMutation,
  useAddWordToSavedListMutation,
  useGetMyListsQuery,
} from "../redux/services/listsApi";
import { WordType } from "../types";
import { closeModal } from "../utils/modalControl";

const AddToListModal: React.FC<{
  word: WordType;
  refetch?: () => QueryActionCreatorResult<
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
      WordType,
      "vocabApi"
    >
  >;
  autoRefetch?: boolean;
}> = ({ word, refetch, autoRefetch }) => {
  const { data: session } = useSession();
  const [postError, setPostError] = useState("");
  const [newListName, setNewListName] = useState("");
  const [inputError, setInputError] = useState<string>("");
  const { isLoading, error, data, isFetching } = useGetMyListsQuery();
  const [addWordToSavedList, { isLoading: isAdding }] =
    useAddWordToSavedListMutation();
  const [addWordToNewList, { isLoading: isAddingToNewList }] =
    useAddWordToNewListMutation();

  const handleAddWordToSavedList = async (listId: number) => {
    try {
      await addWordToSavedList({ listId, word })
        .then(() => closeModal("addToListModal"))
        .then(() => {
          if (autoRefetch) refetch();
        });
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
    if (!newListName) {
      setInputError("Please enter a name");
    } else {
      try {
        await addWordToNewList({ listName: newListName, word })
          .then(() => refetch())
          .then(() => closeModal("addToListModal"));
        setInputError("");
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
    }
  };

  if (postError) return <div>Sorry something went wrong: {postError}</div>;

  return (
    <dialog id="addToListModal" className="modal">
      <div className="modal-box p-6">
        <form method="dialog" className="text-end">
          <button className="btn btn-sm btn-circle btn-ghost text-end">
            ✕
          </button>
        </form>
        {!session ? (
          <>
            <div className="text-center text-xl text-error my-16">
              You need to login to save words.
            </div>
            <div className="text-center">
              <Link href="/api/auth/signin" legacyBehavior>
                <button className="btn btn-neutral btn-lg text-lg">
                  Log In
                </button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h3 className="font-bold text-lg">Add to saved list</h3>
            <ul className="p-4">
              {data &&
                data.savedLists.map((list) => (
                  <li key={list.id} className="flex justify-between mb-4">
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
            {inputError && (
              <div className="text-error text-sm px-4">{inputError}</div>
            )}
          </>
        )}
      </div>
    </dialog>
  );
};

export default AddToListModal;
