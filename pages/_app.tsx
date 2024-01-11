import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import FuriganaProvider from "../contexts/furiganaContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const App = ({ Component, pageProps }: AppProps) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        <FuriganaProvider>
          <Component {...pageProps} />
        </FuriganaProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default App;
