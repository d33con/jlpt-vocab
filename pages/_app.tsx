import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import FuriganaProvider from "../contexts/furiganaContext";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <FuriganaProvider>
        <Component {...pageProps} />
      </FuriganaProvider>
    </SessionProvider>
  );
};

export default App;
