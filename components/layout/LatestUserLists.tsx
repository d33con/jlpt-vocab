import Link from "next/link";
import { useGetAllListsQuery } from "../../redux/services/listsApi";
import { SavedList } from "../../types";
import formatDate from "../../utils/formatDate";
import handleFetchErrors from "../../utils/handleFetchErrors";

const LatestUserLists = () => {
  const { isLoading, error, data } = useGetAllListsQuery();

  if (error)
    return (
      <div className="flex flex-col justify-center mt-8">
        <p className="text-3xl text-center font-bold my-12 text-sky-800 antialiased">
          Latest User Word Lists
        </p>
        <p className="text-xl text-center text-error">
          Sorry, there was an error when fetching the latest user lists:{" "}
          {handleFetchErrors(error)}
        </p>
      </div>
    );

  return (
    <div className="flex flex-col justify-center">
      <p className="text-3xl text-center font-bold my-12 text-sky-800 antialiased">
        Latest User Word Lists
      </p>
      {isLoading ? (
        <div className="flex justify-center mt-8">
          <div className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <div className="w-5/6 md:w-2/3 xl:w-1/2 mx-auto">
          {data?.allLists &&
            data.allLists?.map((list: SavedList) => (
              <div key={list.id}>
                <div className="flex flex-wrap items-center mb-4">
                  <div className="flex flex-col md:flex-row w-full items-center justify-center md:justify-between px-8 mb-2 md:mb-0">
                    <div className="mb-2 md:mb-4 text-xl font-semibold hover:text-sky-600">
                      <Link href={`/my-lists/${list.slug}`} legacyBehavior>
                        {list.name}
                      </Link>
                    </div>
                    <div className="mb-4 font-light">
                      {list.words.length > 1
                        ? `${list.words.length} words`
                        : "1 word"}
                    </div>
                  </div>
                  <div className="flex flex-grow px-8 justify-center md:justify-start">
                    <div>by {list.user.name}</div>
                    <div className="ml-auto font-light italic text-sm">
                      Added on: {formatDate(list.dateAdded)}
                    </div>
                  </div>
                </div>
                <div className="divider" />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default LatestUserLists;
