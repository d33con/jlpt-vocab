import React, { useContext, useState } from "react";
import { WordProps } from "./Word";
import { FuriganaContext } from "../contexts/furiganaContext";

const SavedWord: React.FC<{
  word: WordProps;
  removeFromMyWords: (word: WordProps) => {};
}> = ({ word, removeFromMyWords }) => {
  const [showMeaning, setShowMeaning] = useState(false);
  const { status } = useContext(FuriganaContext);

  const dateAddedString = new Date(word?.dateAdded);

  return (
    <div className="rounded overflow-hidden shadow-md p-8 text-center bg-slate-200">
      <div className="flex justify-between items-center mb-4">
        <div className="bg-white py-1 px-2 font-semibold border border-sky-400 rounded">
          {word?.level}
        </div>
        <button
          onClick={() => removeFromMyWords(word)}
          className="bg-white hover:bg-red-100 text-sm text-red-800 font-semibold py-1 px-2 border border-red-400 rounded shadow"
        >
          Remove
        </button>
      </div>
      <p
        className={`text-lg text-gray-700 mb-1 ${
          status ? "visible" : "invisible"
        } ${!word.furigana && "p-4"}`}
      >
        {word?.furigana}
      </p>
      <p className="text-5xl text-gray-900 mb-8">{word?.word}</p>
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
        Toggle meaning
      </button>
      <p className="text-sm text-gray-600 mt-4">
        Added on: {dateAddedString.toLocaleString().slice(0, 10)}
      </p>
    </div>
  );
};

export default SavedWord;
