import { Sora } from "next/font/google";
import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import DrawerMenu from "../navigation/DrawerMenu";
import Header from "../navigation/Header";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <main className={`${sora.variable} font-sans h-full min-h-screen bg-teal-50`}>
    <div className="drawer">
      <input id="drawer-menu" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <Header />
        {/* Page content here */}
        <div className="p-8">{props.children}</div>
      </div>
      <div className="drawer-side z-20">
        <label
          htmlFor="drawer-menu"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        {/* Sidebar menu */}
        <DrawerMenu />
      </div>
    </div>
    <Toaster
      position="bottom-center"
      toastOptions={{ success: { duration: 4000 } }}
    />
  </main>
);

export default Layout;