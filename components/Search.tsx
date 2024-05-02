import { useState } from "react";
import { WordType } from "../types";
import Word from "./Word";

type SearchResult = {
  total: number;
  offset: number;
  limit: number;
  words: WordType[];
};

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult>(null);

  const searchRequest = async () => {
    const res = await fetch(
      `https://jlpt-vocab-api.vercel.app/api/words?word=${searchTerm}`
    );
    const data = await res.json();
    setResults(data);
  };

  return (
    <section>
      <div className="text-2xl font-semibold text-gray-700 mb-4">Search</div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
      />
      <div className="mt-4 mb-4">
        <button
          onClick={() => searchRequest()}
          className="bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow"
        >
          Search
        </button>
      </div>
      <div className="mb-4">
        {results && results?.total > 0 ? (
          <>
            <div>Found {results?.total} words</div>
            <div>
              {results?.words.map((word) => (
                <Word word={word} />
              ))}
            </div>
          </>
        ) : (
          <div>No results</div>
        )}
      </div>
    </section>
  );
};

export default Search;
