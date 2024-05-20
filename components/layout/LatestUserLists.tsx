import Link from "next/link";
import { useGetAllListsQuery } from "../../redux/services/listsApi";
import formatDate from "../../utils/formatDate";

const LatestUserLists = () => {
  const { isLoading, error, data, isFetching } = useGetAllListsQuery();

  return (
    <div className="flex flex-col justify-center">
      <p className="text-3xl text-center font-bold my-12 text-sky-800 antialiased">
        Latest User Word Lists
      </p>
      <div className="w-5/6 md:w-2/3 xl:w-1/2 mx-auto">
        {data?.allLists &&
          data.allLists?.map((list) => (
            <>
              <div key={list.id} className="flex flex-wrap items-center mb-4">
                <div className="flex flex-col md:flex-row w-full items-center justify-center md:justify-between px-8 mb-2 md:mb-0">
                  <div className="mb-2 md:mb-4 text-xl font-semibold hover:text-sky-600">
                    <Link href={`/my-lists/${list.id}`} legacyBehavior>
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
            </>
          ))}
      </div>
    </div>
  );
};

export default LatestUserLists;
