import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Word from "../../components/Word";

export type Word = {
  word: string;
  meaning: string;
  furigana: string;
  romaji: string;
  level: number;
};

const Level = () => {
  const [word, setWord] = useState<Word>(null);
  const router = useRouter();

  async function fetchNewWord() {
    const res = await fetch(
      `https://jlpt-vocab-api.vercel.app/api/words/random?level=${router.query.level}`
    );
    const data = await res.json();
    setWord(data);
  }

  const addToMyWords = async () => {
    try {
      await fetch(`/api/word`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(word),
      });
      fetchNewWord();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNewWord();
  }, [router.query.level]);

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
