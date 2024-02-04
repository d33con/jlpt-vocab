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
      <div>
        <span className="me-2 text-sm">Meaning</span>
        <label className="relative inline-flex cursor-pointer items-center align-middle">
          <input
            id="meaningToggle"
            type="checkbox"
            className="peer sr-only"
            checked={showMeaning}
            onChange={() => setShowMeaning(!showMeaning)}
          />
          <label htmlFor="meaningToggle" className="hidden"></label>
          <div className="peer h-4 w-11 rounded-full border bg-slate-300 after:absolute after:-top-1 after:left-0 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-400 peer-checked:after:translate-x-full peer-focus:ring-sky-400"></div>
        </label>
      </div>
    </div>
  );
};

export default MeaningWithToggle;
