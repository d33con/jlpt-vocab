import { Tooltip } from "react-tooltip";
import { useAppSelector } from "../../redux/hooks";
import { useGetKanjiDetailsQuery } from "../../redux/services/kanjiApi";
import handleFetchErrors from "../../utils/handleFetchErrors";

const KanjiDetail = () => {
  const kanjiCharacter = useAppSelector(
    (state) => state.setKanjiCharacterReducer.kanjiCharacter
  );
  const {
    isLoading,
    isFetching,
    error,
    data: kanjiDetail,
  } = useGetKanjiDetailsQuery(
    { kanji: kanjiCharacter },
    { skip: !kanjiCharacter }
  );

  return (
    kanjiDetail && (
      <Tooltip anchorSelect=".kanji">
        <div className="p-4">
          {error && (
            <div>
              Sorry there was an error when getting this kanji's details:{" "}
              {handleFetchErrors(error)}
            </div>
          )}
          <div>
            <p className="text-2xl mb-3">{kanjiCharacter}</p>
            <p className="text-start mb-1">
              Meaning:{" "}
              {kanjiDetail.meanings.map((meaning, i) => (
                <span key={meaning} className="me-1">
                  {`${meaning}${
                    i < kanjiDetail.meanings.length - 1 ? "," : ""
                  }`}
                </span>
              ))}
            </p>
            {(!isLoading || !isFetching) && (
              <>
                <p className="text-start mb-1">
                  Kun readings:{" "}
                  {kanjiDetail.kun_readings.map((kun, i) => (
                    <span key={kun} className="me-1">
                      {`${kun}${
                        i < kanjiDetail.kun_readings.length - 1 ? "," : ""
                      }`}
                    </span>
                  ))}
                </p>
                <p className="text-start mb-1">
                  On readings:{" "}
                  {kanjiDetail.on_readings.map((on, i) => (
                    <span key={on} className="me-1">
                      {`${on}${
                        i < kanjiDetail.on_readings.length - 1 ? "," : ""
                      }`}
                    </span>
                  ))}
                </p>
              </>
            )}
          </div>
        </div>
      </Tooltip>
    )
  );
};

export default KanjiDetail;
