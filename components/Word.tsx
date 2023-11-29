import React, { useState } from "react";

export type WordProps = {
  id?: number;
  word: string;
  meaning: string;
  furigana: string;
  romaji: string;
  level: number;
};

const Word: React.FC<{ word: WordProps }> = ({ word }) => {
  const [showFurigana, setShowFurigana] = useState(false);

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
      <p className="text-2xl text-gray-700">{word?.meaning}</p>
    </div>
  );
};

export default Word;
