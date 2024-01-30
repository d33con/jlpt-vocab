import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { useState } from "react";
import "tailwindcss/tailwind.css";
import FuriganaProvider from "../contexts/furiganaContext";
import "../styles/globals.css";
import { Providers } from "../redux/provider";

const App = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <Providers>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={pageProps.session}>
          <FuriganaProvider>
            <Component {...pageProps} />
          </FuriganaProvider>
        </SessionProvider>
      </QueryClientProvider>
    </Providers>
  );
};

export default App;
