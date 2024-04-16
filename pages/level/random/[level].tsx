import { GetServerSidePropsContext } from "next";
import AddToListModal from "../../../components/AddToListModal";
import Layout from "../../../components/Layout";
import Word from "../../../components/Word";
import { useGetNewWordByLevelQuery } from "../../../redux/services/vocabApi";
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
          <div>Sorry something went wrong when getting a new word</div>
        ) : word ? (
          <>
            <section className="mb-4 text-2xl">
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
