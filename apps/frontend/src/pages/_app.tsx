import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";

import defaultQueryFn from "@lib/callAPI";

import "../styles/globals.css";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60,
            queryFn: defaultQueryFn
        }
    }
});

const App = ({
    Component,
    pageProps: { session, ...pageProps }
}: AppProps<{ session: Session }>) => (
    <SessionProvider
        session={session}
        refetchInterval={7200}
        refetchOnWindowFocus
    >
        <QueryClientProvider client={queryClient}>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme: "dark",
                    fontFamily: "Inter, sans-serif",
                    colors: {
                        cod_gray: [
                            "#C4C4C4",
                            "#969696",
                            "#828282",
                            "#636363",
                            "#4A4A4A",
                            "#3B3B3B",
                            "#262626",
                            "#141414",
                            "#0A0A0A",
                            "#030303"
                        ]
                    }
                }}
            >
                <Component {...pageProps} />
                <ReactQueryDevtools initialIsOpen={false} />
            </MantineProvider>
        </QueryClientProvider>
    </SessionProvider>
);

export default App;
