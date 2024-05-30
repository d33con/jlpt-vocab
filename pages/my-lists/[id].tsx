import { createSelector } from "@reduxjs/toolkit";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MultiValue } from "react-select";
import Layout from "../../components/layout/Layout";
import LoadingScreen from "../../components/layout/LoadingScreen";
import NotAuthorised from "../../components/layout/NotAuthorised";
import LevelSelect from "../../components/list/LevelSelect";
import WordSort from "../../components/list/WordSort";
import SavedWord from "../../components/word/SavedWord";
import { useConfirm } from "../../hooks/useConfirm";
import useCurrentUserIsOwner from "../../hooks/useCurrentUserIsOwner";
import {
  useDeleteListMutation,
  useGetSavedListQuery,
  useRemoveWordFromListMutation,
} from "../../redux/services/listsApi";
import { SavedListResponse, WordType } from "../../types";
import handleFetchErrors from "../../utils/handleFetchErrors";

const SavedList = ({ id }: { id: string }) => {
  const router = useRouter();

  const [selectedLevels, setSelectedLevels] = useState<number[]>([]);
  const [selectedSort, setSelectedSort] = useState<string>("");
  const { isLoading, error, data, isFetching, refetch } = useGetSavedListQuery({
    listId: id,
  });
  const { ask } = useConfirm();

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
        const filtered = data?.list.words.filter((word: WordType) =>
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
  const [removewordFromList] = useRemoveWordFromListMutation();
  const [deleteList, { isLoading: isDeletingList }] = useDeleteListMutation();

  const handleDeleteList = async () => {
    try {
      const okToDelete = await ask("Are you sure?");
      if (!okToDelete) return;

      await deleteList(Number(id)).then(() => toast.success("List deleted"));
      router.push("/my-lists");
    } catch (error) {
      toast.error(
        `An error occurred when deleting this list: ${handleFetchErrors(error)}`
      );
    }
  };

  const handleRemoveWordFromList = async (word: WordType) => {
    try {
      const okToDelete = await ask("Are you sure?");
      if (!okToDelete) return;

      await removewordFromList({ listId: data.list.id, word }).then(() =>
        toast.success("Word removed from list")
      );
    } catch (error) {
      toast.error(
        `An error occurred deleting this word: ${handleFetchErrors(error)}`
      );
    }
  };

  const filterWordList = (
    levels: MultiValue<{ value: number; level: string }>
  ) => {
    const selectedOptions = [] as number[];
    levels.map((level) => selectedOptions.push(level.value));
    setSelectedLevels(selectedOptions);
  };

  const isListOwner = useCurrentUserIsOwner(data?.list?.user?.email);
  if (isLoading || isDeletingList) return <LoadingScreen />;

  if (!isListOwner) return <NotAuthorised pageTitle="Saved List" />;

  if (error) {
    return (
      <Layout>
        <p className="text-center text-2xl mb-8">My Saved Words</p>
        <div className="text-center">
          An error occurred when fetching this list: {handleFetchErrors(error)}
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
      <div>
        <div className="text-center mb-4">
          <Link href="/my-lists/" legacyBehavior>
            <button className="btn btn-ghost btn-sm">
              &lt;- Back to my lists
            </button>
          </Link>
        </div>
        <p className="text-center text-2xl mb-4">{data.list.name}</p>
        <p className="text-center text-xl italic mb-8 text-gray-500">
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
        <section className="mb-8 flex flex-col lg:flex-row gap-6 justify-center items-center">
          <LevelSelect
            filterWordList={filterWordList}
            levelCounts={data.levelCounts}
            selectedLevels={selectedLevels}
          />
          <WordSort setSelectedSort={setSelectedSort} />
        </section>
        <section className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
          {(selectedLevels || selectedSort) && filteredSortedWords
            ? filteredSortedWords.map((word: WordType) => (
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
      </div>
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
