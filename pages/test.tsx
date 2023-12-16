import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Word, { WordProps } from "../components/Word";
import TestCompleted from "../components/TestCompleted";

const Test = () => {
  const [dontKnowWords, setDontKnowWords] = useState<WordProps[]>([]);
  const [knownWords, setKnownWords] = useState<WordProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentArrayPosition, setCurrentArrayPosition] = useState(0);

  useEffect(() => {
    fetchMyWords();
  }, []);

  function shuffleWords(words: WordProps[]) {
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
    setDontKnowWords(shuffledWords);
    setIsLoading(false);
  }

  function showNextWord(wordStatus?: string) {
    wordStatus === "known"
      ? setCurrentArrayPosition(0)
      : setCurrentArrayPosition(currentArrayPosition + 1);
  }

  function handleKnownWord() {
    const knownWord = dontKnowWords.shift();
    setDontKnowWords(dontKnowWords);
    setKnownWords((prevState) => prevState.concat(knownWord));
    showNextWord("known");
  }

  function handleDontKnowWord() {
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
          {dontKnowWords.length === 0 ? (
            <TestCompleted restartTest={fetchMyWords} />
          ) : (
            <>
              <p className="mb-4">
                Words left in this test: {dontKnowWords.length}
              </p>
              <Word word={dontKnowWords[currentArrayPosition]} />
              <div className="flex justify-around mt-12 w-1/4">
                <div className="flex flex-col">
                  <div className="pb-2 italic">{knownWords.length}</div>
                  <button
                    onClick={() => handleKnownWord()}
                    className="bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow"
                  >
                    I know it
                  </button>
                </div>
                <div className="flex flex-col">
                  <div className="pb-2 italic">{dontKnowWords.length}</div>
                  <button
                    onClick={() => handleDontKnowWord()}
                    className="bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow"
                  >
                    I don't know it
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Test;
