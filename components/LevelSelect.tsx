import { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import { LevelCounts } from "../types";
import JLPTLevels from "../utils/levels";

interface LevelSelectProps {
  filterWordList: (value: MultiValue<{}>) => void;
  levelCounts: LevelCounts[];
  selectedLevels: number[];
}

const LevelSelect: React.FC<LevelSelectProps> = ({
  filterWordList,
  levelCounts,
  selectedLevels,
}) => {
  const [value, setValue] = useState<{ value: number; label: string }[]>([]);
  useEffect(() => {
    setValue(
      selectOptions.filter((option) => selectedLevels.includes(option.value))
    );
  }, [levelCounts]);

  const handleOnChange = (e: MultiValue<{ value: number; label: string }>) => {
    setValue(e as { value: number; label: string }[]);
    filterWordList(e);
  };

  const wordLevelCount = (level: number) => {
    const levelObject = levelCounts?.find(
      (levelObj) => level === levelObj.level
    );
    return levelObject ? levelObject._count.word : 0;
  };

  const selectOptions = JLPTLevels.map((level) => ({
    value: level,
    label: `Level ${String(level)} (${wordLevelCount(level)})`,
  }));

  return (
    <>
      <div>Filter by level</div>
      <Select
        isMulti
        name="levels"
        options={selectOptions}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={(value) => handleOnChange(value)}
        placeholder="Select levels"
        value={value}
      />
    </>
  );
};

export default LevelSelect;
