import React, { ReactNode } from "react";
import Header from "./Header";
import { Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-raleway",
});

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <main className={`${sora.variable} font-sans`}>
    <Header />
    {/* put drawer here? */}
    <div className="p-8">{props.children}</div>
  </main>
);

export default Layout;
