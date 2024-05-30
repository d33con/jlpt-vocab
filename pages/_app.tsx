import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { useState } from "react";
import "tailwindcss/tailwind.css";
import { Providers } from "../redux/provider";
import "../styles/globals.css";
import DeleteConfirmationModal from "../components/modal/DeleteConfirmationModal";
import { ConfirmContextProvider } from "../hooks/useConfirm";

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
          <ConfirmContextProvider>
            <DeleteConfirmationModal />
            <Component {...pageProps} />
          </ConfirmContextProvider>
        </SessionProvider>
      </QueryClientProvider>
    </Providers>
  );
};

export default App;
