import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../../../components/Layout";
import Word from "../../../components/Word";
import { useGetNewWordByLevelQuery } from "../../../redux/services/vocabApi";
import { useAddToMyWordsMutation } from "../../../redux/services/wordsApi";
import AddToListModal from "../../../components/AddToListModal";

const Level = () => {
  const router = useRouter();

  const [postError, setPostError] = useState("");
  const {
    isLoading,
    error,
    data: word,
    isFetching,
    refetch,
  } = useGetNewWordByLevelQuery({ level: router.query.level as string });
  const [addToMyWords, { isLoading: isAdding }] = useAddToMyWordsMutation();

  if (postError) return <div>Sorry something went wrong: {postError}</div>;

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center w-full h-max">
        {error ? (
          <div>Sorry something went wrong when getting a new word</div>
        ) : word ? (
          <>
            <Word word={word} loading={isLoading || isFetching} />
            <div className="flex justify-around mt-12 w-1/4">
              <button
                onClick={() => refetch()}
                className="btn btn-neutral btn-outline"
              >
                Next word
              </button>
              <button
                onClick={() =>
                  document.getElementById("addToListModal").showModal()
                }
                className="btn btn-neutral btn-outline"
              >
                Add to list
              </button>
            </div>
            <AddToListModal word={word} refetch={refetch} />
          </>
        ) : null}
      </main>
    </Layout>
  );
};

export default Level;
