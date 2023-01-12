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
                fontFamily: "Inter, sans-serif",
                colors: {
                    slate_black: [
                        "#f2f2f2",
                        "#d9d9d9",
                        "#bfbfbf",
                        "#a6a6a6",
                        "#8c8c8c",
                        "#737373",
                        "#595959",
                        "#404040",
                        "#262626",
                        "#0d0d0d"
                    ],
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
                    ],
                    tonal_gray: [
                        "#f9faf9",
                        "#f0f2f3",
                        "#dcdfe3",
                        "#b5bcc3",
                        "#87949a",
                        "#687174",
                        "#535757",
                        "#3f4041",
                        "#2b2b2d",
                        "#1a1a1d"
                    ]
                }
            }}
        >
            <Component {...pageProps} />
        </MantineProvider>
    </SessionProvider>
);

export default App;
