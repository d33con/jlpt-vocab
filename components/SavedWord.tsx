import React from "react";
import { useAppSelector } from "../redux/hooks";
import { WordProps } from "./Word";
import MeaningWithToggle from "./MeaningWithToggle";

const SavedWord: React.FC<{
  word: WordProps;
  removeFromMyWords: (word: WordProps) => void;
}> = ({ word, removeFromMyWords }) => {
  const furiganaStatus = useAppSelector((state) => state.furiganaReducer.value);

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
          furiganaStatus ? "visible" : "invisible"
        } ${!word.furigana && "p-4"}`}
      >
        {word?.furigana}
      </p>
      <p className="text-5xl text-gray-900 mb-8">{word?.word}</p>
      <MeaningWithToggle meaning={word?.meaning} />
      <p className="text-sm text-gray-600 mt-4">
        Added on: {dateAddedString.toLocaleString().slice(0, 10)}
      </p>
    </div>
  );
};

export default SavedWord;
