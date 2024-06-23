import { Sora } from "next/font/google";
import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import DrawerMenu from "../navigation/DrawerMenu";
import Header from "../navigation/Header";
import Head from "next/head";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

type Props = {
  children: ReactNode;
};

const Layout = (props: Props) => (
  <>
    <Head>
      <title>JLPT Vocab App: Practice Japanese vocabulary</title>
    </Head>
    <div
      className={`${sora.variable} font-sans h-full min-h-screen bg-teal-50`}
    >
      <div className="drawer">
        <input id="drawer-menu" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Navbar */}
          <Header />
          {/* Page content */}
          <main className="p-8">{props.children}</main>
        </div>
        <nav className="drawer-side z-20">
          <label
            htmlFor="drawer-menu"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          {/* Sidebar menu */}
          <DrawerMenu />
        </nav>
      </div>
      <Toaster
        position="bottom-center"
        toastOptions={{ success: { duration: 4000 } }}
      />
    </div>
  </>
);

export default Layout;
