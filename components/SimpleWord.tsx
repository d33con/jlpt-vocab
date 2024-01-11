import React, { useContext, useState } from "react";
import { FuriganaContext } from "../contexts/furiganaContext";
import { WordProps } from "./Word";

const SimpleWord: React.FC<{ word: WordProps }> = ({ word }) => {
  const { status } = useContext(FuriganaContext);
  const [error, setError] = useState("");

  // use custom hook
  async function addToMyWords(word: WordProps) {
    try {
      await fetch(`/api/words`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(word),
      });
    } catch (error) {
      setError(error);
    }
  }

  return (
    <div className="rounded shadow-md mb-4 px-12 py-4 text-center bg-slate-200 flex flex-row items-center">
      <div className="flex flex-col w-1/3 items-start">
        {word.furigana && (
          <div
            className={`text-sm text-gray-700 ${
              status ? "visible" : "invisible"
            } ${!word.furigana && "p-4"}`}
          >
            {word?.furigana}
          </div>
        )}
        <div className="text-3xl text-gray-900">{word?.word}</div>
      </div>
      <div className="text-xl text-gray-700 me-auto" title={word?.meaning}>
        {word?.meaning.length > 35
          ? word.meaning.slice(0, 35).concat("...")
          : word.meaning}
      </div>
      <button
        onClick={() => addToMyWords(word)}
        className="bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow ms-auto"
      >
        Add to my words
      </button>
    </div>
  );
};

export default SimpleWord;
