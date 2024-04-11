import Link from "next/link";

const TestCompleted = ({ restartTest }) => {
  return (
    <>
      <p className="text-center text-2xl mb-8">Test Completed</p>
      <div className="flex justify-around mt-12 w-1/4">
        <button onClick={restartTest} className="btn btn-accent btn-outline">
          Test again
        </button>
        <Link href="/my-lists" legacyBehavior>
          <button className="mr-2">
            <a className="btn btn-neutral btn-outline">Go to My lists</a>
          </button>
        </Link>
      </div>
    </>
  );
};

export default TestCompleted;
