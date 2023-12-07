import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Word, { WordProps } from "../components/Word";
import TestCompleted from "../components/TestCompleted";

const Test = () => {
  const [words, setWords] = useState<WordProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(0);

  useEffect(() => {
    fetchMyWords();
  }, []);

  function shuffleWords(words: WordProps[]): WordProps[] {
    const shuffled = [...words];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  async function fetchMyWords() {
    const res = await fetch("api/words");
    const data = await res.json();
    const shuffledWords = shuffleWords(data.words);
    setWords(shuffledWords);
    setIsLoading(false);
  }

  function showNextWord() {
    currentPosition > 0
      ? setCurrentPosition(0)
      : setCurrentPosition(currentPosition + 1);
  }

  function knownWord(word) {
    const remainingWords = words.filter(
      (testingWords) => word !== testingWords
    );
    setWords(remainingWords);
    showNextWord();
  }

  if (isLoading) {
    return (
      <Layout>
        <p className="text-center text-2xl mb-8">Test</p>
        <div className="text-center">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="text-center">
        <p className="text-center text-2xl mb-8">Test</p>
        <div className="flex flex-col items-center justify-center w-full h-max">
          {words.length === 0 ? (
            <TestCompleted restartTest={fetchMyWords} />
          ) : (
            <>
              <p className="mb-4">Words left in this test: {words.length}</p>
              <Word word={words[currentPosition]} />
              <div className="flex justify-around mt-12 w-1/4">
                <button
                  onClick={() => knownWord(words[currentPosition])}
                  className="bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow"
                >
                  I know it
                </button>
                <button
                  onClick={() => showNextWord()}
                  className="bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow"
                >
                  I don't know it
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Test;
