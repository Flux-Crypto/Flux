import { MantineProvider } from "@mantine/core";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";

const App = ({
    Component,
    pageProps: { session, ...pageProps }
}: AppProps<{ session: Session }>) => (
    <SessionProvider
        session={session}
        refetchInterval={7200}
        refetchOnWindowFocus
    >
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme: "dark",
                fontFamily: "Inter, sans-serif"
            }}
        >
            <Component {...pageProps} />
        </MantineProvider>
    </SessionProvider>
);

export default App;
