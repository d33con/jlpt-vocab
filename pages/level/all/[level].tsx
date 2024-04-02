import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Layout from "../../../components/Layout";
import SimpleWord from "../../../components/SimpleWord";
import { WordProps } from "../../../components/Word";

const BrowseLevel = () => {
  const router = useRouter();
  const { ref, inView } = useInView();

  const fetchWords = async ({ pageParam }) => {
    const response = await fetch(
      `https://jlpt-vocab-api.vercel.app/api/words?level=${parseInt(
        router.query.level as string
      )}&offset=${pageParam}&limit=10`
    );
    return await response.json();
  };

  const { data, error, fetchNextPage, status } = useInfiniteQuery({
    queryKey: ["words", router.query.level],
    queryFn: fetchWords,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.offset + 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, router.query.level, fetchNextPage]);

  if (status == "error")
    return <div>Sorry something went wrong: {error.message}</div>;

  if (status == "pending")
    return (
      <Layout>
        <div className="flex justify-center">
          <div className="loading loading-spinner loading-lg" />
        </div>
      </Layout>
    );

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center w-full h-max">
        <section className="mb-4 text-2xl">
          JLPT Level {router.query.level}
        </section>
        <section className="mb-8 text-lg">{data?.pages[0].total} words</section>
        <Link href={`/level/random/${router.query.level}`} legacyBehavior>
          <button className="btn btn-neutral btn-outline mr-2">
            Random word
          </button>
        </Link>
        <section className="mt-8 w-3/4">
          {data?.pages.map((group, i) => (
            <Fragment key={i}>
              {group.words.map((word: WordProps) => (
                <SimpleWord word={word} key={word.id} />
              ))}
            </Fragment>
          ))}
          <div ref={ref} className="h-1"></div>
        </section>
      </main>
    </Layout>
  );
};

export default BrowseLevel;
