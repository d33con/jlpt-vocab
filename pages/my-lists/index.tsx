import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/layout/Layout";
import LoadingScreen from "../../components/layout/LoadingScreen";
import NotAuthorised from "../../components/layout/NotAuthorised";
import { useConfirm } from "../../hooks/useConfirm";
import {
  useDeleteListMutation,
  useGetMyListsQuery,
  useRenameListMutation,
} from "../../redux/services/listsApi";
import formatDate from "../../utils/formatDate";
import handleFetchErrors from "../../utils/handleFetchErrors";

const MySavedLists = () => {
  const { data: session } = useSession();
  const [showRenameInput, setShowRenameInput] = useState<number | null>(null);
  const [newListName, setNewListName] = useState("");
  const { isLoading, error, data, isFetching } = useGetMyListsQuery();
  const [deleteList] = useDeleteListMutation();
  const [renameList, { isLoading: isRenaming }] = useRenameListMutation();
  const { ask } = useConfirm();

  const handleRenameList = async (listId: number) => {
    try {
      await renameList({ listId, newName: newListName })
        .then(() => setShowRenameInput(null))
        .then(() => setNewListName(""))
        .then(() => toast.success(`Successfully renamed list: ${newListName}`));
    } catch (error) {
      toast.error(
        `An error occurred when renaming this list: ${handleFetchErrors(error)}`
      );
    }
  };

  const handleDeleteList = async (listId: number) => {
    try {
      const okToDelete = await ask("Are you sure?");
      if (!okToDelete) return;

      await deleteList(listId).then(() => toast.success("List deleted"));
    } catch (error) {
      toast.error(
        `An error occurred when deleting this list: ${handleFetchErrors(error)}`
      );
    }
  };

  if (!session) return <NotAuthorised pageTitle="My Saved Lists" />;

  if (isLoading || isFetching)
    return <LoadingScreen pageTitle="My Saved Lists" />;

  if (error) {
    return (
      <Layout>
        <p className="text-center text-2xl mb-8">My Saved Lists</p>
        <div className="text-center">
          An error occurred when fetching this list: {handleFetchErrors(error)}
        </div>
      </Layout>
    );
  }

  if (data.savedLists.length === 0) {
    return (
      <Layout>
        <p className="text-center text-2xl mb-8">My Saved Lists</p>
        <div className="text-center">You don't have any saved lists</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <p className="text-center text-2xl mb-8">My Saved Lists</p>
        <div className="w-5/6 md:w-2/3 xl:w-1/2 mx-auto">
          {data.savedLists &&
            data.savedLists.map((list) => (
              <div key={list.id}>
                <div className="flex flex-wrap items-center mb-4">
                  <div className="flex flex-col md:flex-row w-full items-center justify-center md:justify-between px-8 mb-2 md:mb-0">
                    <div className="mb-2 md:mb-4 text-xl font-semibold">
                      {list.name}
                    </div>
                    <div className="mb-4 font-light">
                      {list.words.length > 1
                        ? `${list.words.length} words`
                        : "1 word"}
                    </div>
                  </div>
                  <div className="flex flex-grow px-8 justify-center md:justify-start">
                    <div
                      className={`${
                        showRenameInput === list.id ? "hidden" : "flex"
                      }`}
                    >
                      <Link href={`/my-lists/${list.slug}`} legacyBehavior>
                        <button className="btn btn-neutral btn-outline btn-sm mr-4">
                          Open
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteList(list.id)}
                        className="btn btn-error btn-outline btn-sm mr-4"
                      >
                        Delete
                      </button>
                    </div>
                    {showRenameInput === list.id ? (
                      <button
                        onClick={() => setShowRenameInput(null)}
                        className="btn btn-info btn-outline btn-sm mr-4"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowRenameInput(list.id)}
                        className="btn btn-info btn-outline btn-sm mr-4"
                      >
                        Rename
                      </button>
                    )}
                    {showRenameInput === list.id && (
                      <div className="flex justify-between">
                        <input
                          id={`list-${list.id}`}
                          type="text"
                          placeholder="Enter new list name"
                          className="input input-bordered input-sm w-full max-w-xs mr-4"
                          value={newListName}
                          onChange={(e) =>
                            setNewListName(e.currentTarget.value)
                          }
                        />
                        <button
                          onClick={() => handleRenameList(list.id)}
                          className="btn btn-neutral btn-outline btn-sm"
                        >
                          {isRenaming && showRenameInput === list.id
                            ? "Renaming..."
                            : "Rename"}
                        </button>
                      </div>
                    )}
                    <Link href={`/my-lists/${list.slug}/test`} legacyBehavior>
                      <button
                        className={`btn btn-accent btn-outline btn-sm mr-2 ${
                          showRenameInput === list.id ? "hidden" : ""
                        }`}
                      >
                        Test
                      </button>
                    </Link>
                  </div>
                  <div className="flex flex-grow items-center justify-center md:justify-end mt-4 lg:mt-0 pe-8 font-light text-xs">
                    Created on: {formatDate(list.dateAdded)}
                  </div>
                </div>
                <div className="divider" />
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default MySavedLists;
