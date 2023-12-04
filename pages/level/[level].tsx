import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Word, { WordProps } from "../../components/Word";
import { useEffect, useState } from "react";

const Level = () => {
  const router = useRouter();
  const [word, setWord] = useState<WordProps>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNewWord();
  }, [router.query.level]);

  async function fetchNewWord() {
    try {
      const res = await fetch(
        `https://jlpt-vocab-api.vercel.app/api/words/random?level=${router.query.level}`
      );
      setWord(await res.json());
      setIsLoading(false);
    } catch (error) {
      setError(error);
    }
  }

  async function addToMyWords() {
    try {
      await fetch(`/api/words`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(word),
      });
      fetchNewWord();
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
        <Word word={word} />
        <div className="flex justify-around mt-12 w-1/4">
          <button
            onClick={() => fetchNewWord()}
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
      </main>
    </Layout>
  );
};

export default Level;
