import { useSession } from "next-auth/react";
import Layout from "../../components/Layout";
import {
  useDeleteListMutation,
  useGetMyListsQuery,
} from "../../redux/services/listsApi";
import Link from "next/link";

const MySavedLists = () => {
  const { data: session } = useSession();
  const { isLoading, error, data, isFetching, refetch } = useGetMyListsQuery();
  const [deleteList, { isLoading: isDeleting }] = useDeleteListMutation();

  if (!session) {
    return (
      <Layout>
        <p className="text-center text-2xl">My Saved Lists</p>
        <div>You need to login to view this page.</div>
      </Layout>
    );
  }

  if (isLoading) {
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
                        className="btn btn-error btn-outline btn-sm"
                      >
                        Delete
                      </button>
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
