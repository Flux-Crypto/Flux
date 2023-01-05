import { ClerkProvider } from "@clerk/nextjs";
import { MantineProvider } from "@mantine/core";
import colors from "@theme/index";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

const App = ({ Component, pageProps }: AppProps) => {
    const { push } = useRouter();

    return (
        <ClerkProvider {...pageProps} navigate={(to) => push(to)}>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    /** Put your mantine theme override here */
                    colorScheme: "dark",
                    fontFamily: "Inter, sans-serif"
                }}
            >
                <Component {...pageProps} />
            </MantineProvider>
        </ClerkProvider>
    );
};

export default App;
