import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import LoadingScreen from "../../../components/LoadingScreen";
import TestCompleted from "../../../components/TestCompleted";
import Word, { WordProps } from "../../../components/Word";
import { useGetSavedListQuery } from "../../../redux/services/listsApi";

const Test = ({ id }: { id: string }) => {
  const { isLoading, error, data } = useGetSavedListQuery({
    listId: id,
  });
  const [dontKnowWords, setDontKnowWords] = useState<WordProps[]>([]);
  const [knownWords, setKnownWords] = useState<WordProps[]>([]);

  useEffect(() => {
    if (data) {
      setTestWords();
    }
  }, [data]);

  const setTestWords = () => {
    const shuffled = [...data.list.words];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setDontKnowWords(shuffled);
  };

  const handleKnownWord = () => {
    const knownWord = dontKnowWords.shift();
    setDontKnowWords(dontKnowWords);
    setKnownWords((prevState) => prevState.concat(knownWord));
  };

  const handleDontKnowWord = () => {
    const unknownWord = dontKnowWords.shift();
    setDontKnowWords((prevState) => prevState.concat(unknownWord));
  };

  const restartTest = () => {
    setTestWords();
    setKnownWords([]);
  };

  if (isLoading) return <LoadingScreen pageTitle="Test" />;

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
        <p className="text-center text-2xl mb-8">Test</p>
        <div className="text-center">
          Sorry there was an error with this test: {errMsg}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="text-center">
        <p className="text-center text-2xl mb-8">Test - {data.list.name}</p>
        <div className="flex flex-col items-center justify-center w-full h-max">
          {dontKnowWords.length === 0 ? (
            <TestCompleted restartTest={restartTest} />
          ) : (
            <>
              <p className="mb-4">
                Words left in this test: {dontKnowWords.length}
              </p>
              <Word word={dontKnowWords[0]} />
              <div className="flex justify-around mt-12 w-1/4">
                <div className="flex flex-col">
                  <div className="pb-2 italic text-green-600">
                    {knownWords.length}
                  </div>
                  <button
                    onClick={() => handleKnownWord()}
                    className="btn btn-success btn-outline"
                  >
                    I know it
                  </button>
                </div>
                <div className="flex flex-col">
                  <div className="pb-2 italic text-red-600">
                    {dontKnowWords.length}
                  </div>
                  <button
                    onClick={() => handleDontKnowWord()}
                    className="btn btn-error btn-outline"
                  >
                    I don't know it
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      id: context.query.id,
    },
  };
}

export default Test;
