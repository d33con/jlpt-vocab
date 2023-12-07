import Link from "next/link";

const TestCompleted = ({ restartTest }) => {
  return (
    <>
      <p className="text-center text-2xl mb-8">Test Completed</p>
      <div className="flex justify-around mt-12 w-1/4">
        <button
          onClick={() => restartTest()}
          className="bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow"
        >
          Test again
        </button>
        <Link href="/my-words" legacyBehavior>
          <button className="mr-2">
            <a className="bg-white hover:bg-sky-100 text-sky-800 font-semibold py-2 px-4 border border-sky-400 rounded shadow">
              Go to My words
            </a>
          </button>
        </Link>
      </div>
    </>
  );
};

export default TestCompleted;
