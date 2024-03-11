import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../../../components/Layout";
import Word from "../../../components/Word";
import { useGetNewWordByLevelQuery } from "../../../redux/services/vocabApi";
import { useAddToMyWordsMutation } from "../../../redux/services/wordsApi";

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

  const handleAddWord = async () => {
    try {
      await addToMyWords(word).then(() => refetch());
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
                onClick={handleAddWord}
                className="bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow"
              >
                {isAdding ? (
                  <span className="loading loading-dots loading-xs"></span>
                ) : (
                  "Add to my words"
                )}
              </button>
            </div>
          </>
        ) : null}
      </main>
    </Layout>
  );
};

export default Level;
