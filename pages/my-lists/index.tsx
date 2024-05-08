import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";
import LoadingScreen from "../../components/LoadingScreen";
import NotAuthorised from "../../components/NotAuthorised";
import {
  useDeleteListMutation,
  useGetMyListsQuery,
  useRenameListMutation,
} from "../../redux/services/listsApi";

const MySavedLists = () => {
  const { data: session } = useSession();
  const [showRenameInput, setShowRenameInput] = useState<number | null>(null);
  const [newListName, setNewListName] = useState("");
  const { isLoading, error, data, isFetching } = useGetMyListsQuery();
  const [deleteList, { isLoading: isDeleting }] = useDeleteListMutation();
  const [renameList, { isLoading: isRenaming }] = useRenameListMutation();

  const handleRenameList = async (listId: number) => {
    try {
      await renameList({ listId, newName: newListName })
        .then(() => setShowRenameInput(null))
        .then(() => setNewListName(""))
        .then(() => toast.success(`Successfully renamed list: ${newListName}`));
    } catch (error) {
      let errMsg: string;

      if ("status" in error) {
        // you can access all properties of `FetchBaseQueryError` here
        errMsg = "error" in error ? error.error : JSON.stringify(error.data);
      } else {
        // you can access all properties of `SerializedError` here
        errMsg = error.message;
      }
      // setPostError(errMsg);
      // toast({
      //   title: 'An error occurred',
      //   description: "We couldn't save your post, try again!",
      //   status: 'error',
      //   duration: 2000,
      //   isClosable: true,
      // })
    }
  };

  const handleDeleteList = async (listId: number) => {
    try {
      await deleteList(listId).then(() => toast.success("List deleted"));
    } catch (error) {
      let errMsg: string;

      if ("status" in error) {
        // you can access all properties of `FetchBaseQueryError` here
        errMsg = "error" in error ? error.error : JSON.stringify(error.data);
      } else {
        // you can access all properties of `SerializedError` here
        errMsg = error.message;
      }
      // setPostError(errMsg);
      // toast({
      //   title: 'An error occurred',
      //   description: "We couldn't save your post, try again!",
      //   status: 'error',
      //   duration: 2000,
      //   isClosable: true,
      // })
    }
  };

  if (!session) return <NotAuthorised pageTitle="My Saved Lists" />;

  if (isLoading || isFetching)
    return <LoadingScreen pageTitle="My Saved Lists" />;

  if (error) {
    let errMsg: string;

    if ("status" in error) {
      // you can access all properties of `FetchBaseQueryError` here
      errMsg = "error" in error ? error.error : JSON.stringify(error.data);
    } else {
      // you can access all properties of `SerializedError` here
      errMsg = error.message;
    }
    return (
      <Layout>
        <p className="text-center text-2xl mb-8">My Saved Lists</p>
        <div className="text-center">
          Sorry there was an error fetching your saved lists: {errMsg}
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
              <>
                <div key={list.id} className="flex flex-wrap items-center mb-4">
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
                      <Link href={`/my-lists/${list.id}`} legacyBehavior>
                        <button className="btn btn-neutral btn-outline btn-sm mr-4">
                          Open
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteList(list.id)}
                        className="btn btn-error btn-outline btn-sm mr-4"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
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
                          {isRenaming ? "Renaming..." : "Rename"}
                        </button>
                      </div>
                    )}
                    <Link href={`/my-lists/${list.id}/test`} legacyBehavior>
                      {/* <Test words={list.words} > */}
                      <button
                        className={`btn btn-accent btn-outline btn-sm ${
                          showRenameInput === list.id ? "hidden" : ""
                        }`}
                      >
                        Test
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="divider" />
              </>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default MySavedLists;
