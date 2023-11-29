import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Layout from "../components/Layout";
import { WordProps } from "../components/Word";
import prisma from "../lib/prisma";
import SavedWord from "../components/SavedWord";
import useSWR from "swr";
import { useState } from "react";

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   const session = await getSession({ req });
//   if (!session) {
//     res.statusCode = 403;
//     return { props: { words: [] } };
//   }

//   const words = await prisma.word.findMany({
//     where: {
//       user: { email: session.user.email },
//     },
//   });
//   return {
//     props: { words },
//   };
// };

type Props = {
  words: WordProps[];
};

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const MyWords: React.FC<Props> = (props) => {
  const [level, setLevel] = useState(0);
  const { data: session } = useSession();
  const {
    data: words,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/user/words", fetcher);

  const filterWordList = () => {
  };

  const removeFromMyWords = async (word: WordProps) => {
    try {
      await fetch(`/api/word`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(word),
      });
      mutate();
    } catch (error) {
      console.error(error);
    }
  };

  if (!session) {
    return (
      <Layout>
        <p className="text-center text-2xl">My Saved Words</p>
        <div>You need to login to view this page.</div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <p className="text-center text-2xl">My Saved Words</p>
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main>
        <p className="text-center text-2xl mb-8">My Saved Words</p>
        <section className="mb-8 flex justify-center">
          <button
            onClick={() => filterWordList()}
            className="bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow mr-4"
          >
            Show Level 5
          </button>
          <button
            onClick={() => filterWordList()}
            className="bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow mr-4"
          >
            Show Level 4
          </button>
        </section>
        <section className="container mx-auto grid grid-cols-4 gap-4">
          {words &&
            words.map((word) => (
              <SavedWord
                word={word}
                key={word.id}
                removeFromMyWords={removeFromMyWords}
              />
            ))}
        </section>
      </main>
    </Layout>
  );
};

export default MyWords;
