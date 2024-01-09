import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import SimpleWord from "../../../components/SimpleWord";
import { WordProps } from "../../../components/Word";

const BrowseLevel = () => {
  const router = useRouter();
  const [words, setWords] = useState<WordProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNewWord();
  }, [router.query.level]);

  async function fetchNewWord() {
    try {
      const res = await fetch(
        `https://jlpt-vocab-api.vercel.app/api/words?level=${router.query.level}&offset=0&limit=10`
      );
      const data = await res.json();
      setWords(data.words);
      setIsLoading(false);
    } catch (error) {
      setError(error);
    }
  }

  if (error) return <div>Sorry something went wrong: {error}</div>;

  if (isLoading)
    return (
      <Layout>
        <div className="text-center">Loading...</div>
      </Layout>
    );

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center w-full h-max">
        <section className="mb-8 text-2xl">
          JLPT Level {router.query.level}
        </section>
        <Link href={`/level/random/${router.query.level}`} legacyBehavior>
          <button className="mr-2">
            <a className="bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow">
              Random word
            </a>
          </button>
        </Link>
        <section className="mt-8 w-3/4">
          {words.map((word) => (
            <SimpleWord word={word} key={word.id} />
          ))}
        </section>
      </main>
    </Layout>
  );
};

export default BrowseLevel;
