import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { MultiValue } from "react-select";
import Layout from "../components/Layout";
import LevelSelect from "../components/LevelSelect";
import SavedWord from "../components/SavedWord";
import WordSort from "../components/WordSort";
import {
  useGetMyFilteredWordsQuery,
  useGetMyWordsQuery,
  useRemoveFromMyWordsMutation,
} from "../redux/services/wordsApi";

const MyWords = () => {
  const { data: session } = useSession();

  const [selectedLevels, setSelectedLevels] = useState<Array<number>>([]);
  const { isLoading, error, data, isFetching, refetch } = useGetMyWordsQuery();
  const { data: filteredWords } = useGetMyFilteredWordsQuery(selectedLevels);
  const [removeFromMyWords, { isLoading: isDeleting }] =
    useRemoveFromMyWordsMutation();

  async function filterWordList(
    levels: MultiValue<{ value: number; level: string }>
  ) {
    const selectedOptions = [] as number[];
    levels.map((level) => selectedOptions.push(level.value));
    setSelectedLevels(selectedOptions);
  }

  function sortWordList(e: { label: string; value: string }) {
    switch (e.value) {
      case "date-asc":
        const sortedDateAsc = [...data.words].sort(
          (a, b) =>
            new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        );
        setFilteredWords(sortedDateAsc);
        break;
      case "date-desc":
        const sortedDateDesc = [...data.words].sort(
          (a, b) =>
            new Date(a.dateAdded).getTime() + new Date(b.dateAdded).getTime()
        );
        setFilteredWords(sortedDateDesc);
        break;
      case "level-asc":
        const sortedLevelAsc = [...data.words].sort(
          (a, b) => a.level - b.level
        );
        setFilteredWords(sortedLevelAsc);
        break;
      case "level-desc":
        const sortedLevelDesc = [...data.words].sort(
          (a, b) => a.level + b.level
        );
        setFilteredWords(sortedLevelDesc);
        break;
      case "meaning-asc":
        const sortedMeaningAsc = [...data.words].sort((a, b) =>
          a.meaning.localeCompare(b.meaning)
        );
        setFilteredWords(sortedMeaningAsc);
        break;
      case "meaning-desc":
        const sortedMeaningDesc = [...data.words].sort((a, b) =>
          b.meaning.localeCompare(a.meaning)
        );
        setFilteredWords(sortedMeaningDesc);
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

  if (isLoading) {
    return (
      <Layout>
        <p className="text-center text-2xl mb-8">My Saved Words</p>
        <div className="text-center">Loading...</div>
      </Layout>
    );
  }

  if (error) {
    let errMsg: string;

    if ("status" in error) {
      // you can access all properties of `FetchBaseQueryError` here
      errMsg = "error" in error ? error.error : JSON.stringify(error.data);
    } else {
      // you can access all properties of `SerializedError` here
      errMsg = error.message;
    }
    return (
      <Layout>
        <p className="text-center text-2xl mb-8">My Saved Words</p>
        <div className="text-center">
          Sorry there was an error fetching your words: {errMsg}
        </div>
      </Layout>
    );
  }

  if (data.total === 0) {
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
          My Saved Words ({data.total})
        </p>
        <div className="flex flex-col content-center items-center mb-8">
          <Link href={`/test`} legacyBehavior>
            <button className="btn btn-accent mr-2">Study these words</button>
          </Link>
        </div>
        <section className="mb-8 flex justify-center items-center">
          <LevelSelect
            filterWordList={filterWordList}
            totalLevelWordCount={data.levels}
          />
          <WordSort sortWordList={sortWordList} />
        </section>
        <section className="container mx-auto grid lg:grid-cols-4 sm:grid-cols-2 gap-4">
          {filteredWords.words.length > 0
            ? filteredWords.words.map((word) => (
                <SavedWord
                  word={word}
                  key={word.id}
                  removeFromMyWords={removeFromMyWords}
                />
              ))
            : data.words.map((word) => (
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
