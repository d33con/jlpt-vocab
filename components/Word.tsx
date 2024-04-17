import React from "react";
import { useAppSelector } from "../redux/hooks";
import kanjiRegex from "../utils/kanjiRegex";
import MeaningWithToggle from "./MeaningWithToggle";

export type WordProps = {
  id?: number;
  word: string;
  meaning: string;
  furigana: string;
  romaji: string;
  level: number;
  dateAdded: string;
};

const Word: React.FC<{ word: WordProps; loading?: boolean }> = ({
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
          <p className="text-5xl text-gray-900 mb-8">{word?.word}</p>
          <MeaningWithToggle meaning={word?.meaning} />
        </>
      )}
    </div>
  );
};

export default Word;
