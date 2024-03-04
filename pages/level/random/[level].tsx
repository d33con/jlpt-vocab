import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../../../components/Layout";
import Word from "../../../components/Word";
import { useGetNewWordByLevelQuery } from "../../../redux/services/vocabApi";

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

  async function addToMyWords() {
    try {
      await fetch(`/api/words`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(word),
      });
      refetch();
    } catch (error) {
      setPostError(error);
    }
  }

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
                className="bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow"
              >
                Next word
              </button>
              <button
                onClick={() => addToMyWords()}
                className="bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow"
              >
                Add to my words
              </button>
            </div>
          </>
        ) : null}
      </main>
    </Layout>
  );
};

export default Level;
