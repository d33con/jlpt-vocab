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
          className="hover:bg-gray-300 text-gray-600 text-lg font-semibold w-10 h-10 rounded-full"
        >
          X
        </button>
      </div>
      <p
        className={`text-lg text-gray-700 mb-2 ${
          status ? "visible" : "invisible"
        } ${!word.furigana && "p-4"}`}
      >
        {word?.furigana}
      </p>
      <p className="text-5xl text-gray-900 mb-8">{word?.word}</p>
      <p
        className={`text-xl text-gray-700 mb-4 h-16 ${
          showMeaning ? "visible" : "invisible"
        }`}
        title={word?.meaning}
      >
        {word?.meaning.length > 35
          ? word.meaning.slice(0, 35).concat("...")
          : word.meaning}
      </p>
      <button
        onClick={() => setShowMeaning(!showMeaning)}
        className="bg-white hover:bg-sky-100 text-sky-800 text-sm py-1 px-2 border border-sky-400 rounded shadow"
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
