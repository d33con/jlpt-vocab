import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import SavedWord from "../components/SavedWord";
import { WordProps } from "../components/Word";
import levels from "../utils/levels";
import Link from "next/link";

const MyWords = () => {
  const [selectedLevels, setSelectedLevels] = useState<Array<number>>([]);
  const { data: session } = useSession();
  const [words, setWords] = useState<WordProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalWordsCount, setTotalWordsCount] = useState(0);
  const [totalLevelWordCount, setTotalLevelWordCount] = useState([]);

  useEffect(() => {
    fetchMyWords();
  }, []);

  useMemo(() => {
    if (selectedLevels.length) {
      getFilteredWordsList();
    } else {
      fetchMyWords();
    }
  }, [selectedLevels]);

  async function fetchMyWords() {
    const res = await fetch("api/words");
    const data = await res.json();
    setWords(data.words);
    setTotalWordsCount(data.total);
    setTotalLevelWordCount(data.levels);
    setIsLoading(false);
  }

  const filterWordList = async (level: number) => {
    setSelectedLevels((prevState) => {
      if (prevState.includes(level))
        return prevState.filter((stateLevel) => level !== stateLevel);
      return [...prevState, level];
    });
  };

  async function getFilteredWordsList() {
    const filtered = await fetch(`/api/words?level=[${selectedLevels}]`);
    const filteredWords = await filtered.json();
    setWords(filteredWords.words);
  }

  const removeFromMyWords = async (word: WordProps) => {
    const res = await fetch(`/api/words?id=${word.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(word),
    });
    const data = await res.json();
    setWords(data.words);
    setTotalWordsCount(data.total);
    setTotalLevelWordCount(data.levels);
  };

  function wordLevelCount(level: number) {
    const levelObject = totalLevelWordCount?.find(
      (levelObj) => level === levelObj.level
    );
    return levelObject ? levelObject._count.word : 0;
  }

  if (!session) {
    return (
      <Layout>
        <p className="text-center text-2xl">My Saved Words</p>
        <div>You need to login to view this page.</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <p className="text-center text-2xl mb-8">My Saved Words</p>
        <div className="text-center">
          Sorry there was an error fetching your words: {error}
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <p className="text-center text-2xl mb-8">My Saved Words</p>
        <div className="text-center">Loading...</div>
      </Layout>
    );
  }

  if (totalWordsCount === 0) {
    return (
      <Layout>
        <p className="text-center text-2xl mb-8">My Saved Words</p>
        <div className="text-center">You don't have any saved words</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main>
        <p className="text-center text-2xl mb-8">
          My Saved Words ({totalWordsCount})
        </p>
        <div className="flex flex-col content-center items-center mb-8">
          <Link href={`/test`} legacyBehavior>
            <button className="mr-2">
              <a className="bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow">
                Study these words
              </a>
            </button>
          </Link>
        </div>
        <section className="mb-8 flex justify-center">
          {levels.map((level: number) => {
            let activeLevel = selectedLevels.includes(level);
            return (
              <button
                key={level}
                onClick={() => filterWordList(level)}
                className={`${
                  activeLevel ? "bg-sky-100" : "bg-white"
                } hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow mr-4`}
              >
                {activeLevel ? "Hide" : "Show"} Level {level}
                <span className="text-sky-600 text-sm">
                  ({wordLevelCount(level)})
                </span>
              </button>
            );
          })}
        </section>
        <section className="container mx-auto grid grid-cols-4 gap-4">
          {words.map((word) => (
            <SavedWord
              word={word}
              key={word.id}
              removeFromMyWords={removeFromMyWords}
            />
          ))}
        </section>
      </main>
    </Layout>
  );
};

export default MyWords;
