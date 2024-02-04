import { toggle } from "../redux/features/furiganaSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const FuriganaToggle = () => {
  const furiganaStatus = useAppSelector((state) => state.furiganaReducer.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <span className="me-2">Furigana</span>
      <label className="relative inline-flex cursor-pointer items-center align-middle">
        <input
          id="furiganaToggle"
          type="checkbox"
          className="peer sr-only"
          checked={furiganaStatus}
          onChange={() => dispatch(toggle())}
        />
        <label htmlFor="furiganaToggle" className="hidden"></label>
        <div className="peer h-4 w-11 rounded-full border bg-slate-300 after:absolute after:-top-1 after:left-0 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-400 peer-checked:after:translate-x-full peer-focus:ring-sky-400"></div>
      </label>
    </div>
  );
};

export default FuriganaToggle;
