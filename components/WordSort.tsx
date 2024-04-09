import Select from "react-select";

interface WordSortProps {
  setSelectedSort: (value: string) => void;
}

const WordSort: React.FC<WordSortProps> = ({ setSelectedSort }) => {
  const options = [
    {
      value: "date-asc",
      label: "Date ascending",
    },
    {
      value: "date-desc",
      label: "Date descending",
    },
    {
      value: "level-asc",
      label: "Level ascending",
    },
    {
      value: "level-desc",
      label: "Level descending",
    },
    {
      value: "meaning-asc",
      label: "Meaning A-Z",
    },
    {
      value: "meaning-desc",
      label: "Meaning Z-A",
    },
  ];
  return (
    <>
      <div className="mr-4 ml-4">Sort by</div>
      <Select
        name="sort"
        options={options}
        defaultValue={options[0]}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={(option) => setSelectedSort(option.value)}
        placeholder="Sort by..."
      />
    </>
  );
};

export default WordSort;
