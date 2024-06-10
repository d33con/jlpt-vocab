import { useInfiniteQuery } from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import AddToListModal from "../../../components/modal/AddToListModal";
import Layout from "../../../components/layout/Layout";
import LoadingScreen from "../../../components/layout/LoadingScreen";
import SimpleWord from "../../../components/word/SimpleWord";
import { setWordToAdd } from "../../../redux/features/addWordToListSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { WordType } from "../../../types";
import { showModal } from "../../../utils/toggleModal";

const BrowseLevel = ({ level }: { level: number }) => {
  const { ref, inView } = useInView();
  const wordToAdd = useAppSelector((state) => state.addWordToListReducer.word);
  const dispatch = useAppDispatch();

  const fetchWords = async ({ pageParam }) => {
    const response = await fetch(
      `https://jlpt-vocab-api.vercel.app/api/words?level=${level}&offset=${pageParam}&limit=10`
    );
    return await response.json();
  };

  const { data, error, fetchNextPage, status } = useInfiniteQuery({
    queryKey: ["words", level],
    queryFn: fetchWords,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.offset + 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, level, fetchNextPage]);

  const handleAddToList = (word: WordType) => {
    dispatch(setWordToAdd(word));
    showModal("addToListModal");
  };

  if (status == "error")
    return <div>Sorry something went wrong: {error.message}</div>;

  if (status == "pending") return <LoadingScreen />;

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center w-full h-max">
        <section className="mb-4 text-2xl">JLPT Level {level}</section>
        <section className="mb-8 text-lg">{data?.pages[0].total} words</section>
        <Link href={`/level/random/${level}`} legacyBehavior>
          <button className="btn btn-neutral btn-outline mr-2">
            Random word
          </button>
        </Link>
        <section className="mt-8 w-2/3">
          {data?.pages.map((group, i) => (
            <Fragment key={i}>
              {group.words.map((word: WordType) => (
                <SimpleWord
                  word={word}
                  key={word.id}
                  handleAddToList={handleAddToList}
                />
              ))}
            </Fragment>
          ))}
          <div ref={ref} className="h-1"></div>
        </section>
        <AddToListModal word={wordToAdd} />
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

export default BrowseLevel;
