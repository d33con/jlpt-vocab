import { createSelector } from "@reduxjs/toolkit";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { MultiValue } from "react-select";
import Layout from "../../components/Layout";
import LevelSelect from "../../components/LevelSelect";
import SavedWord from "../../components/SavedWord";
import { WordProps } from "../../components/Word";
import WordSort from "../../components/WordSort";
import {
  SavedListResponse,
  useDeleteListMutation,
  useGetSavedListQuery,
  useRemoveWordFromListMutation,
} from "../../redux/services/listsApi";
import { GetServerSidePropsContext } from "next";

const SavedList = ({ id }: { id: string }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [selectedLevels, setSelectedLevels] = useState<number[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("");
  const { isLoading, error, data, isFetching, refetch } = useGetSavedListQuery({
    listId: id,
  });
  const selectFilteredSortedWords = useMemo(() => {
    // Return a unique selector instance for this page so that
    // the filtered and / or sorted results are correctly memoized
    return createSelector(
      [
        (res: SavedListResponse) => res,
        (res: SavedListResponse, selectedLevels: number[]) => selectedLevels,
        (
          res: SavedListResponse,
          selectedLevels: number[],
          selectedSort: string
        ) => selectedSort,
      ],
      (data, selectedLevels, selectedSort) => {
        const filtered = data?.list.words.filter((word: WordProps) =>
          selectedLevels.length ? selectedLevels.includes(word.level) : word
        );

        switch (selectedSort) {
          case "date-asc":
            filtered.sort(
              (a, b) =>
                new Date(a.dateAdded).getTime() -
                new Date(b.dateAdded).getTime()
            );
            break;
          case "date-desc":
            filtered.sort(
              (a, b) =>
                new Date(a.dateAdded).getTime() +
                new Date(b.dateAdded).getTime()
            );
            break;
          case "level-asc":
            filtered.sort((a, b) => a.level - b.level);
            break;
          case "level-desc":
            filtered.sort((a, b) => b.level - a.level);
            break;
          case "meaning-asc":
            filtered.sort((a, b) => a.meaning.localeCompare(b.meaning));
            break;
          case "meaning-desc":
            filtered.sort((a, b) => b.meaning.localeCompare(a.meaning));
            break;
          default:
            break;
        }
        return filtered ?? [];
      }
    );
  }, [selectedLevels, selectedSort]);

  const { filteredSortedWords } = useGetSavedListQuery(
    { listId: id },
    {
      selectFromResult: ({ data }) => ({
        ...data,
        filteredSortedWords: selectFilteredSortedWords(
          data,
          selectedLevels,
          selectedSort
        ),
      }),
    }
  );
  const [removewordFromList, { isLoading: isDeletingWord }] =
    useRemoveWordFromListMutation();
  const [deleteList, { isLoading: isDeletingList }] = useDeleteListMutation();

  const handleDeleteList = async () => {
    try {
      await deleteList(data.list.id); //.unwrap();
      router.push("/my-lists");
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveWordFromList = async (word: WordProps) => {
    try {
      await removewordFromList({ listId: data.list.id, word }); //.unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const filterWordList = (
    levels: MultiValue<{ value: number; level: string }>
  ) => {
    const selectedOptions = [] as number[];
    levels.map((level) => selectedOptions.push(level.value));
    setSelectedLevels(selectedOptions);
  };

  if (!session) {
    return (
      <Layout>
        <p className="text-center text-2xl">My Saved Words</p>
        <div>You need to login to view this page.</div>
      </Layout>
    );
  }

  if (isLoading || isDeletingList) {
    return (
      <Layout>
        <p className="text-center text-2xl mb-8">My Saved Words</p>
        <div className="flex justify-center">
          <div className="loading loading-spinner loading-lg" />
        </div>
      </Layout>
    );
  }

  if (error) {
    let errMsg: string;

    if ("status" in error) {
      // you can access all properties of `FetchBaseQueryError` here
      errMsg = "error" in error ? error.error : JSON.stringify(error.data);
    } else {
      // you can access all properties of `SerializedError` here
      errMsg = error.message;
    }
    return (
      <Layout>
        <p className="text-center text-2xl mb-8">My Saved Words</p>
        <div className="text-center">
          Sorry there was an error fetching your words: {errMsg}
        </div>
      </Layout>
    );
  }

  if (data.list.words.length === 0) {
    return (
      <Layout>
        <p className="text-center text-2xl mb-8">{data.list.name}</p>
        <div className="text-center">This list is empty</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main>
        <div className="text-center mb-4">
          <Link href="/my-lists/" legacyBehavior>
            <button className="btn btn-ghost btn-sm">
              &lt;- Back to my lists
            </button>
          </Link>
        </div>
        <p className="text-center text-2xl mb-4">{data.list.name}</p>
        <p className="text-center text-xl italic mb-8">
          {`${data.list.words.length} words`}
        </p>
        <div className="flex justify-center mb-8">
          <Link href={`/my-lists/${id}/test`} legacyBehavior>
            <button className="btn btn-accent mr-2">Test list</button>
          </Link>
          <button
            onClick={handleDeleteList}
            className="btn btn-error btn-outline"
          >
            Delete list
          </button>
        </div>
        <section className="mb-8 flex justify-center items-center">
          <LevelSelect
            filterWordList={filterWordList}
            levelCounts={data.levelCounts}
            selectedLevels={selectedLevels}
          />
          <WordSort setSelectedSort={setSelectedSort} />
        </section>
        <section className="container mx-auto grid lg:grid-cols-4 sm:grid-cols-2 gap-4">
          {(selectedLevels || selectedSort) && filteredSortedWords
            ? filteredSortedWords.map((word: WordProps) => (
                <SavedWord
                  word={word}
                  key={word.id}
                  removeWordFromList={handleRemoveWordFromList}
                />
              ))
            : data.list?.words.map((word) => (
                <SavedWord
                  word={word}
                  key={word.id}
                  removeWordFromList={handleRemoveWordFromList}
                />
              ))}
        </section>
      </main>
    </Layout>
  );
};

// https://github.com/vercel/next.js/discussions/11484#discussioncomment-143163
// using router.query.id caused double fetching as router.query.id is initially undefined
// better to use getServerSideProps in this case
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      id: context.query.id,
    },
  };
}

export default SavedList;
