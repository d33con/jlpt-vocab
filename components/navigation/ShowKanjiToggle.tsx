import { toggle } from "../../redux/features/showKanjiSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const ShowKanjiToggle = () => {
  const kanjiStatus = useAppSelector((state) => state.showKanjiReducer.value);
  const dispatch = useAppDispatch();

  return (
    <div className="flex justify-between items-center">
      <span className="mx-2">Kanji</span>
      <input
        id="kanjiToggle"
        type="checkbox"
        className="toggle"
        checked={kanjiStatus}
        onChange={() => dispatch(toggle())}
      />
    </div>
  );
};

export default ShowKanjiToggle;
