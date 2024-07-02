import React from "react";
import { WordType } from "../../types";
import formatDate from "../../utils/formatDate";
import Furigana from "./Furigana";
import JapaneseWord from "./JapaneseWord";
import KanjiDetail from "./KanjiDetail";
import MeaningWithToggle from "./MeaningWithToggle";

const SavedWordCard: React.FC<{
  word: WordType;
  removeWordFromList: (word: WordType) => void;
  isListOwner: boolean;
}> = ({ word, removeWordFromList, isListOwner }) => (
  <div className="rounded overflow-hidden shadow-md p-8 text-center bg-slate-200">
    <div className="flex justify-between items-center mb-4">
      <div className="badge badge-neutral">{word?.level}</div>
      {isListOwner && (
        <button
          onClick={() => removeWordFromList(word)}
          className="btn btn-sm btn-error btn-outline font-bold"
        >
          X
        </button>
      )}
    </div>
    <Furigana furigana={word.furigana} />
    <JapaneseWord word={word.word} />
    <KanjiDetail />
    <MeaningWithToggle meaning={word?.meaning} />
    <p className="text-xs text-gray-600 mt-4">
      Added on: {formatDate(word?.dateAdded)}
    </p>
  </div>
);

export default SavedWordCard;
