import Layout from "./Layout";

const LoadingScreen = ({ pageTitle }: { pageTitle?: string }) => {
  return (
    <Layout>
      {pageTitle && <p className="text-center text-2xl mb-8">{pageTitle}</p>}
      <div className="flex justify-center">
        <div className="loading loading-spinner loading-lg" />
      </div>
    </Layout>
  );
};

export default LoadingScreen;
