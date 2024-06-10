import Select from "react-select";

const WordSort = ({
  setSelectedSort,
}: {
  setSelectedSort: (value: string) => void;
}) => {
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
      <div>Sort by</div>
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
