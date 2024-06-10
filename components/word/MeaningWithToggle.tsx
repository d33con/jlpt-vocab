import { useState } from "react";

const MeaningWithToggle = ({ meaning }: { meaning: string }) => {
  const [showMeaning, setShowMeaning] = useState(false);

  return (
    <div>
      <p
        className={`text-lg text-gray-600 mb-4 h-16 ${
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
          className="toggle toggle-sm"
          checked={showMeaning}
          onChange={() => setShowMeaning(!showMeaning)}
        />
      </div>
    </div>
  );
};

export default MeaningWithToggle;
