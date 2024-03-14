import { toggle } from "../redux/features/furiganaSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const FuriganaToggle = () => {
  const furiganaStatus = useAppSelector((state) => state.furiganaReducer.value);
  const dispatch = useAppDispatch();

  return (
    <div className="flex justify-between items-center ms-4">
      <span className="me-2">Furigana</span>
      <input
        id="furiganaToggle"
        type="checkbox"
        className="toggle"
        checked={furiganaStatus}
        onChange={() => dispatch(toggle())}
      />
    </div>
  );
};

export default FuriganaToggle;
