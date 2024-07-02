import React from "react";
import { setCharacter } from "../../redux/features/setKanjiCharacterSlice";
import { useAppDispatch } from "../../redux/hooks";
import kanjiRegex from "../../utils/kanjiRegex";

const JapaneseWord: React.FC<{ word: string; horizontal?: boolean }> = ({
  word,
  horizontal,
}) => {
  const dispatch = useAppDispatch();

  const wrapperClasses = horizontal
    ? "text-4xl text-gray-900"
    : "text-5xl text-gray-900 mb-8";

  return (
    <p className={wrapperClasses}>
      {word.split("").map((w, i) =>
        kanjiRegex.test(w) ? (
          <span
            key={`${w}-${i}`}
            className="kanji"
            onMouseEnter={() => dispatch(setCharacter(w))}
          >
            {w}
          </span>
        ) : (
          <span key={`${w}-${i}`} className="no-kanji">
            {w}
          </span>
        )
      )}
    </p>
  );
};

export default JapaneseWord;
