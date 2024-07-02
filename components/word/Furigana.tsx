import { useAppSelector } from "../../redux/hooks";

const Furigana: React.FC<{ furigana: string }> = ({ furigana }) => {
  const furiganaStatus = useAppSelector((state) => state.furiganaReducer.value);

  return furigana ? (
    <p
      className={`text-base text-gray-700 mb-2 ${
        furiganaStatus ? "visible" : "invisible"
      }`}
    >
      {furigana}
    </p>
  ) : null;
};

export default Furigana;
