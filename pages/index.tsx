import React from "react";
import Layout from "../components/Layout";

const Home = () => {
  return (
    <Layout>
      <div className="text-center">
        <p className="text-4xl font-bold mb-8 text-gray-900">JLPT Vocab App</p>
        <p className="text-2xl font-semibold mb-8 text-gray-700">
          Practice Japanese vocab
        </p>
      </div>
    </Layout>
  );
};

export default Home;
