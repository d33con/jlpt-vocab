import React, { useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { useAddToMyWordsMutation } from "../redux/services/wordsApi";
import { WordProps } from "./Word";

const SimpleWord: React.FC<{ word: WordProps; key: number }> = ({
  word,
  key,
}) => {
  const furiganaStatus = useAppSelector((state) => state.furiganaReducer.value);
  const [postError, setPostError] = useState("");
  const [addToMyWords, { isLoading: isAdding }] = useAddToMyWordsMutation();

  const handleAddWord = async () => {
    try {
      await addToMyWords(word);
    } catch (error) {
      let errMsg: string;

      if ("status" in error) {
        // you can access all properties of `FetchBaseQueryError` here
        errMsg = "error" in error ? error.error : JSON.stringify(error.data);
      } else {
        // you can access all properties of `SerializedError` here
        errMsg = error.message;
      }
      setPostError(errMsg);
      // toast({
      //   title: 'An error occurred',
      //   description: "We couldn't save your post, try again!",
      //   status: 'error',
      //   duration: 2000,
      //   isClosable: true,
      // })
    }
  };

  return (
    <div
      key={key}
      className="rounded shadow-md mb-4 px-12 py-4 text-center bg-slate-200 flex flex-row items-center"
    >
      <div className="flex flex-col w-1/3 items-start">
        {word.furigana && (
          <div
            className={`text-sm text-gray-700 ${
              furiganaStatus ? "visible" : "invisible"
            } ${!word.furigana && "p-4"}`}
          >
            {word?.furigana}
          </div>
        )}
        <div className="text-3xl text-gray-900">{word?.word}</div>
      </div>
      <div className="text-xl text-gray-700 me-auto" title={word?.meaning}>
        {word?.meaning.length > 35
          ? word.meaning.slice(0, 35).concat("...")
          : word.meaning}
      </div>
      <button
        onClick={handleAddWord}
        className="bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow ms-auto"
      >
        {isAdding ? (
          <span className="loading loading-dots loading-xs"></span>
        ) : (
          "Add to my words"
        )}
      </button>
    </div>
  );
};

export default SimpleWord;
