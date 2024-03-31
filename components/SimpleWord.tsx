import React from "react";
import { useAppSelector } from "../redux/hooks";
import AddToListModal from "./AddToListModal";
import { WordProps } from "./Word";

const SimpleWord: React.FC<{ word: WordProps; key: number }> = ({
  word,
  key,
}) => {
  const furiganaStatus = useAppSelector((state) => state.furiganaReducer.value);

  return (
    <div
      key={key}
      className="rounded shadow-md mb-4 px-12 py-4 text-center bg-slate-200 flex flex-row items-center"
    >
      <div className="flex flex-col w-1/3 items-start">
        {word.furigana && (
          <div
            className={`text-sm text-gray-700 ${
              furiganaStatus ? "visible" : "invisible"
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
        onClick={() => document.getElementById("addToListModal").showModal()}
        className="btn btn-neutral btn-outline mr-2"
      >
        Add to list
      </button>
      <AddToListModal word={word} autoRefetch={false} />
    </div>
  );
};

export default SimpleWord;
