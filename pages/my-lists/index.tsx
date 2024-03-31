import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Layout from "../../components/Layout";
import {
  useDeleteListMutation,
  useGetMyListsQuery,
  useRenameListMutation,
} from "../../redux/services/listsApi";

const MySavedLists = () => {
  const { data: session } = useSession();
  const [showRenameInput, setShowRenameInput] = useState(false);
  const [newListName, setNewListName] = useState("");
  const { isLoading, error, data, isFetching } = useGetMyListsQuery();
  const [deleteList, { isLoading: isDeleting }] = useDeleteListMutation();
  const [renameList, { isLoading: isRenaming }] = useRenameListMutation();

  const handleRenameList = async (listId: number) => {
    try {
      await renameList({ listId, newName: newListName }).then(() =>
        setShowRenameInput(false)
      );
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

  if (!session) {
    return (
      <Layout>
        <p className="text-center text-2xl">My Saved Lists</p>
        <div>You need to login to view this page.</div>
      </Layout>
    );
  }

  if (isLoading || isFetching) {
    return (
      <Layout>
        <p className="text-center text-2xl mb-8">My Saved Lists</p>
        <div className="flex justify-center">
          <div className="loading loading-spinner loading-lg" />
        </div>
      </Layout>
    );
  }

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
      <main>
        <p className="text-center text-2xl mb-8">My Saved Lists</p>
        <div className="overflow-x-auto w-1/2 m-auto">
          <table className="table">
            <tbody>
              {data.savedLists &&
                data.savedLists.map((list) => (
                  <tr key={list.id}>
                    <td>{list.name}</td>
                    <td>{list.words.length} words</td>
                    <td className="flex">
                      <Link href={`/my-lists/${list.id}`} legacyBehavior>
                        <button className="btn btn-neutral btn-outline btn-sm mr-4">
                          Open
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteList(list.id)}
                        className="btn btn-error btn-outline btn-sm mr-4"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                      <button
                        onClick={() => setShowRenameInput(!showRenameInput)}
                        className="btn btn-info btn-outline btn-sm mr-2"
                      >
                        {showRenameInput ? "Close" : "Rename"}
                      </button>
                      {showRenameInput && (
                        <div className="flex justify-between">
                          <input
                            id={`list-${list.id}`}
                            type="text"
                            placeholder="Enter new list name"
                            className="input input-bordered input-sm w-full max-w-xs mr-2"
                            value={newListName}
                            onChange={(e) =>
                              setNewListName(e.currentTarget.value)
                            }
                          />
                          <button
                            onClick={() => handleRenameList(list.id)}
                            className="btn btn-neutral btn-outline btn-sm"
                          >
                            Rename
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </main>
    </Layout>
  );
};

export default MySavedLists;