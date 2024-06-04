import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import Layout from "../../../components/layout/Layout";
import LoadingScreen from "../../../components/layout/LoadingScreen";
import NotAuthorised from "../../../components/layout/NotAuthorised";
import TestCompleted from "../../../components/test/TestCompleted";
import Word from "../../../components/word/Word";
import useCurrentUserIsOwner from "../../../hooks/useCurrentUserIsOwner";
import { useGetSavedListQuery } from "../../../redux/services/listsApi";
import { WordType } from "../../../types";
import handleFetchErrors from "../../../utils/handleFetchErrors";

const Test = ({ slug }: { slug: string }) => {
  const { isLoading, error, data } = useGetSavedListQuery({
    slug,
  });
  const [dontKnowWords, setDontKnowWords] = useState<WordType[]>([]);
  const [knownWords, setKnownWords] = useState<WordType[]>([]);

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
    setKnownWords([]);
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

  const isListOwner = useCurrentUserIsOwner(data?.list?.user?.email);
  if (isLoading) return <LoadingScreen pageTitle="Test" />;
  if (!isListOwner) return <NotAuthorised pageTitle="Test" />;

  if (error) {
    return (
      <Layout>
        <p className="text-center text-2xl mb-8">Test</p>
        <div className="text-center">
          Sorry there was an error with this test: {handleFetchErrors(error)}
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
              <p className="mb-4">Remaining: {dontKnowWords.length}</p>
              <Word word={dontKnowWords[0]} />
              <div className="flex justify-around mt-12 w-1/4">
                <div className="flex flex-col">
                  <div className="pb-2 italic text-green-500">
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
                  <div className="pb-2 italic text-red-400">
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
      slug: context.query.slug,
    },
  };
}

export default Test;
