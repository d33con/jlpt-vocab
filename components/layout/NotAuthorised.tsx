import Link from "next/link";
import Layout from "./Layout";

const NotAuthorised = ({ pageTitle }: { pageTitle?: string }) => {
  return (
    <Layout>
      {pageTitle && <p className="text-center text-2xl">{pageTitle}</p>}
      <div className="text-center text-xl text-error my-16">
        You need to login to view this page.
      </div>
      <div className="text-center">
        <Link href="/api/auth/signin" legacyBehavior>
          <button className="btn btn-neutral btn-lg text-lg">Log In</button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotAuthorised;
