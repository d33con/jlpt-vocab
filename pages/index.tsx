import { useSession } from "next-auth/react";
import Link from "next/link";
import Layout from "../components/Layout";

const Home = () => {
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="h-full flex flex-col justify-center">
        <div className="rounded-xl mx-auto p-24 shadow-lg bg-gradient-to-bl from-indigo-200 via-purple-200 to-sky-200">
          <p className="text-5xl text-center font-bold mb-12 text-sky-800 antialiased">
            JLPT Vocab App
          </p>
          <p className="text-2xl text-center font-semibold mb-12 text-indigo-700">
            Practice Japanese vocab
          </p>

          {!session && (
            <div className="text-center">
              <Link href="/api/auth/signin" legacyBehavior>
                <button className="btn btn-neutral btn-lg text-lg">
                  Log In
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
