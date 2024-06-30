import React from "react";
import { WordType } from "../../types";
import Furigana from "./Furigana";
import JapaneseWord from "./JapaneseWord";
import KanjiDetail from "./KanjiDetail";
import MeaningWithToggle from "./MeaningWithToggle";

const WordCard: React.FC<{ word: WordType; loading?: boolean }> = ({
  word,
  loading,
}) => (
  <div className="w-1/2 md:w-1/4 xl:w-1/5 rounded overflow-hidden shadow-md p-16 text-center bg-slate-200">
    {loading ? (
      <div className="text-center loading loading-spinner loading-lg" />
    ) : (
      <>
        <Furigana furigana={word.furigana} />
        <JapaneseWord word={word.word} />
        <KanjiDetail />
        <MeaningWithToggle meaning={word?.meaning} />
      </>
    )}
  </div>
);

export default WordCard;
