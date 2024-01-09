import Select, { MultiValue } from "react-select";

interface LevelSelectProps {
  filterWordList: (value: MultiValue<{}>) => void;
  totalLevelWordCount: Array<{ _count: { word: number }; level: number }>;
}

const LevelSelect: React.FC<LevelSelectProps> = ({
  filterWordList,
  totalLevelWordCount,
}) => {
  const levels = [5, 4, 3, 2, 1];
  function wordLevelCount(level: number) {
    const levelObject = totalLevelWordCount?.find(
      (levelObj) => level === levelObj.level
    );
    return levelObject ? levelObject._count.word : 0;
  }

  return (
    <>
      <Select
        isMulti
        name="levels"
        options={levels.map((level) => ({
          value: level,
          label: `Level ${String(level)} (${wordLevelCount(level)})`,
        }))}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={(value) => filterWordList(value)}
        placeholder="Select levels"
      />
    </>
  );
};

export default LevelSelect;
