import React, { useState } from "react";

export type WordProps = {
  id?: number;
  word: string;
  meaning: string;
  furigana: string;
  romaji: string;
  level: number;
  dateAdded: string;
};

const Word: React.FC<{ word: WordProps }> = ({ word }) => {
  const [showFurigana, setShowFurigana] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);

  return (
    <div className="w-1/4 h-1/4 rounded overflow-hidden shadow-md p-16 text-center bg-slate-200">
      <p
        className={`text-lg text-gray-700 mb-1 ${
          showFurigana ? "visible" : "invisible"
        }`}
      >
        {word?.furigana}
      </p>
      <p
        className="text-5xl text-gray-900 mb-8"
        onClick={() => setShowFurigana(!showFurigana)}
      >
        {word?.word}
      </p>
      <p
        className={`text-2xl text-gray-700 mb-4 ${
          showMeaning ? "visible" : "invisible"
        }`}
      >
        {word?.meaning}
      </p>
      <button
        onClick={() => setShowMeaning(!showMeaning)}
        className="bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow"
      >
        Show meaning
      </button>
    </div>
  );
};

export default Word;
