import { useState } from "react";

type MeaningWithToggleProps = {
  meaning: string;
};

const MeaningWithToggle = ({ meaning }: MeaningWithToggleProps) => {
  const [showMeaning, setShowMeaning] = useState(false);

  return (
    <div>
      <p
        className={`text-xl text-gray-700 mb-4 h-16 ${
          showMeaning ? "visible" : "invisible"
        }`}
        title={meaning}
      >
        {meaning.length > 35 ? meaning.slice(0, 35).concat("...") : meaning}
      </p>
      <div className="flex justify-center items-center">
        <span className="me-2 text-sm">Meaning</span>
        <input
          id="furiganaToggle"
          type="checkbox"
          className="toggle"
          checked={showMeaning}
          onChange={() => setShowMeaning(!showMeaning)}
        />
      </div>
    </div>
  );
};

export default MeaningWithToggle;
