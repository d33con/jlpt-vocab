import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { WordType } from "../../types";
import JapaneseWord from "./JapaneseWord";
import KanjiDetail from "./KanjiDetail";

const HorizontalWordCard: React.FC<{
  word: WordType;
  handleAddToList: (word: WordType) => void;
}> = ({ word, handleAddToList }) => {
  const furiganaStatus = useAppSelector((state) => state.furiganaReducer.value);

  return (
    <div
      key={word.id}
      className="rounded shadow-md mb-4 p-8 text-center bg-slate-200 flex flex-col lg:flex-row gap-8 lg:gap-0 items-center"
    >
      <div className="flex flex-col w-full lg:w-1/3 lg:text-start">
        {word.furigana && (
          <div
            className={`text-base text-gray-700 ${
              furiganaStatus ? "visible" : "invisible"
            } ${!word.furigana && "p-4"}`}
          >
            {word?.furigana}
          </div>
        )}
        <JapaneseWord word={word.word} horizontal />
      </div>
      <KanjiDetail />
      <div className="text-xl text-gray-700 lg:me-auto" title={word?.meaning}>
        {word?.meaning.length > 35
          ? word.meaning.slice(0, 35).concat("...")
          : word.meaning}
      </div>
      <button
        onClick={() => handleAddToList(word)}
        className="btn btn-neutral btn-outline mr-2"
      >
        Add to list
      </button>
    </div>
  );
};

export default HorizontalWordCard;
