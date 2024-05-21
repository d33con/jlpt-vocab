import { GetServerSidePropsContext } from "next";
import Layout from "../../../components/layout/Layout";
import AddToListModal from "../../../components/modal/AddToListModal";
import Word from "../../../components/word/Word";
import { useGetNewWordByLevelQuery } from "../../../redux/services/vocabApi";
import handleFetchErrors from "../../../utils/handleFetchErrors";
import { showModal } from "../../../utils/modalControl";

const Level = ({ level }: { level: string }) => {
  const {
    isLoading,
    error,
    data: word,
    isFetching,
    refetch,
  } = useGetNewWordByLevelQuery({ level });

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center w-full h-max">
        {error ? (
          <div>
            Sorry something went wrong when getting a new word:{" "}
            {handleFetchErrors(error)}
          </div>
        ) : word ? (
          <>
            <section className="mb-8 text-2xl">
              Random level {level} word
            </section>
            <Word word={word} loading={isLoading || isFetching} />
            <div className="flex flex-col xl:flex-row justify-around mt-12 w-1/4">
              <button
                onClick={() => refetch()}
                className="btn btn-neutral btn-outline mb-4 xl:mb-0"
              >
                Next word
              </button>
              <button
                onClick={() => showModal("addToListModal")}
                className="btn btn-neutral btn-outline"
              >
                Add to list
              </button>
            </div>
            <AddToListModal word={word} refetch={refetch} autoRefetch />
          </>
        ) : null}
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      level: context.query.level,
    },
  };
}

export default Level;
