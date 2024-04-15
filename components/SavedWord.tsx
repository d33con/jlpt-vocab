import React from "react";
import { useAppSelector } from "../redux/hooks";
import MeaningWithToggle from "./MeaningWithToggle";
import { WordProps } from "./Word";

const SavedWord: React.FC<{
  word: WordProps;
  removeWordFromList: (word: WordProps) => void;
}> = ({ word, removeWordFromList }) => {
  const furiganaStatus = useAppSelector((state) => state.furiganaReducer.value);

  const dateAddedString = new Date(word?.dateAdded);

  return (
    <div className="rounded overflow-hidden shadow-md p-8 text-center bg-slate-200">
      <div className="flex justify-between items-center mb-4">
        <div className="badge badge-neutral">{word?.level}</div>
        <button
          onClick={() => removeWordFromList(word)}
          className="btn btn-sm btn-circle text-md text-red-700"
        >
          X
        </button>
      </div>
      <p
        className={`text-base text-gray-700 mb-2 ${
          furiganaStatus ? "visible" : "invisible"
        } ${!word.furigana && "p-4"}`}
      >
        {word?.furigana}
      </p>
      <p className="text-5xl text-gray-900 mb-8">{word?.word}</p>
      <MeaningWithToggle meaning={word?.meaning} />
      <p className="text-xs text-gray-600 mt-4">
        Added on: {dateAddedString.toLocaleString().slice(0, 10)}
      </p>
    </div>
  );
};

export default SavedWord;
