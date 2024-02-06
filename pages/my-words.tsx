import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import SavedWord from "../components/SavedWord";
import { WordProps } from "../components/Word";
import Link from "next/link";
import LevelSelect from "../components/LevelSelect";
import { MultiValue } from "react-select";
import WordSort from "../components/WordSort";

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

  async function filterWordList(
    levels: MultiValue<{ value: number; level: string }>
  ) {
    const selectedOptions = [] as Array<number>;
    levels.map((level) => selectedOptions.push(level.value));
    setSelectedLevels(selectedOptions);
  }

  async function getFilteredWordsList() {
    const filtered = await fetch(`/api/words?level=[${selectedLevels}]`);
    const filteredWords = await filtered.json();
    setWords(filteredWords.words);
  }

  async function removeFromMyWords(word: WordProps) {
    const res = await fetch(`/api/words?id=${word.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(word),
    });
    const data = await res.json();
    setWords(data.words);
    setTotalWordsCount(data.total);
    setTotalLevelWordCount(data.levels);
  }

  function sortWordList(e: { label: string; value: string }) {
    switch (e.value) {
      case "date-asc":
        const sortedDateAsc = [...words].sort(
          (a, b) =>
            new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        );
        setWords(sortedDateAsc);
        break;
      case "date-desc":
        const sortedDateDesc = [...words].sort(
          (a, b) =>
            new Date(a.dateAdded).getTime() + new Date(b.dateAdded).getTime()
        );
        setWords(sortedDateDesc);
        break;
      case "level-asc":
        const sortedLevelAsc = [...words].sort((a, b) => a.level - b.level);
        setWords(sortedLevelAsc);
        break;
      case "level-desc":
        const sortedLevelDesc = [...words].sort((a, b) => a.level + b.level);
        setWords(sortedLevelDesc);
        break;
      case "meaning-asc":
        const sortedMeaningAsc = [...words].sort((a, b) =>
          a.meaning.localeCompare(b.meaning)
        );
        setWords(sortedMeaningAsc);
        break;
      case "meaning-desc":
        const sortedMeaningDesc = [...words].sort((a, b) =>
          b.meaning.localeCompare(a.meaning)
        );
        setWords(sortedMeaningDesc);
        break;
      default:
        break;
    }
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
        <section className="mb-8 flex justify-center items-center">
          <LevelSelect
            filterWordList={filterWordList}
            totalLevelWordCount={totalLevelWordCount}
          />
          <WordSort sortWordList={sortWordList} />
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
