import React from "react";
import Layout from "../components/Layout";
import Search from "../components/Search";

const Home = () => {
  return (
    <Layout>
      <main className="text-center">
        <p className="text-4xl font-bold mb-8 text-gray-900">JLPT Vocab App</p>
        <p className="text-2xl font-semibold mb-8 text-gray-700">
          Practice Japanese vocab
        </p>
        <Search />
      </main>
    </Layout>
  );
};

export default Home;
