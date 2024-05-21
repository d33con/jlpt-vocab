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
import toast from "react-hot-toast";
import {
  useAddWordToNewListMutation,
  useAddWordToSavedListMutation,
  useGetMyListsQuery,
} from "../../redux/services/listsApi";
import { WordType } from "../../types";
import handleFetchErrors from "../../utils/handleFetchErrors";
import { closeModal } from "../../utils/modalControl";

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
  const [newListName, setNewListName] = useState("");
  const [inputError, setInputError] = useState<string>("");
  const { isLoading, error, data } = useGetMyListsQuery();
  const [addWordToSavedList, { isLoading: isAddingToSavedList }] =
    useAddWordToSavedListMutation();
  const [addWordToNewList, { isLoading: isCreatingNewList }] =
    useAddWordToNewListMutation();

  const handleAddWordToSavedList = async (listId: number) => {
    try {
      await addWordToSavedList({ listId, word })
        .then(() => closeModal("addToListModal"))
        .then(() => toast.success("Word added to list"))
        .then(() => {
          if (autoRefetch) refetch();
        });
    } catch (error) {
      toast.error(
        `An error occurred when adding this word: ${handleFetchErrors(error)}`
      );
    }
  };

  const handleAddWordToNewList = async () => {
    if (!newListName) {
      setInputError("Please enter a name");
    } else {
      try {
        await addWordToNewList({ listName: newListName, word })
          .then(() => refetch())
          .then(() => closeModal("addToListModal"))
          .then(() => toast.success(`Word added to new list: ${newListName}`));
        setInputError("");
        setNewListName("");
      } catch (error) {
        toast.error(
          `An error occurred when creating a new list: ${handleFetchErrors(
            error
          )}`
        );
      }
    }
  };

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
            {error && (
              <div className="text-error text-sm px-4">
                There was an error fetching your saved lists:{" "}
                {handleFetchErrors(error)}
              </div>
            )}
            {isLoading || isAddingToSavedList ? (
              <div className="flex justify-center">
                <div className="loading loading-spinner loading-lg" />
              </div>
            ) : (
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
            )}
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
                {isCreatingNewList ? "Creating..." : "Create"}
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
