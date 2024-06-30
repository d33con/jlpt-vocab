import React from "react";
import { useAppSelector } from "../../redux/hooks";
import { WordType } from "../../types";
import JapaneseWord from "./JapaneseWord";
import KanjiDetail from "./KanjiDetail";
import MeaningWithToggle from "./MeaningWithToggle";

const WordCard: React.FC<{ word: WordType; loading?: boolean }> = ({
  word,
  loading,
}) => {
  const furiganaStatus = useAppSelector((state) => state.furiganaReducer.value);

  return (
    <div className="w-1/2 md:w-1/4 xl:w-1/5 rounded overflow-hidden shadow-md p-16 text-center bg-slate-200">
      {loading ? (
        <div className="text-center loading loading-spinner loading-lg" />
      ) : (
        <>
          <p
            className={`text-base text-gray-700 mb-2 ${
              furiganaStatus ? "visible" : "invisible"
            } ${!word.furigana && "p-4"}`}
          >
            {word?.furigana}
          </p>
          <JapaneseWord word={word.word} />
          <KanjiDetail />
          <MeaningWithToggle meaning={word?.meaning} />
        </>
      )}
    </div>
  );
};

export default WordCard;
