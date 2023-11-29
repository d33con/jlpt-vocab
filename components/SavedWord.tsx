import React, { useState } from "react";
import { WordProps } from "./Word";

const SavedWord: React.FC<{
  word: WordProps;
  removeFromMyWords: () => void;
}> = ({ word, removeFromMyWords }) => {
  const [showFurigana, setShowFurigana] = useState(false);

  // const removeFromMyWords = async (word: WordProps) => {
  //   try {
  //     await fetch(`/api/word`, {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(word),
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <div className="rounded overflow-hidden shadow-md p-8 text-center bg-slate-200">
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
      <p className="text-2xl text-gray-700 mb-4">{word?.meaning}</p>
      <div className="flex justify-between items-center">
        <div>Level: {word?.level}</div>
        <button
          onClick={() => removeFromMyWords(word)}
          className="bg-white hover:bg-red-100 text-red-800 font-semibold py-1 px-2 border border-red-400 rounded shadow"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default SavedWord;
