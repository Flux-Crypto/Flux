import { ClerkProvider } from "@clerk/nextjs";
import { MantineProvider } from "@mantine/core";
import { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ClerkProvider {...pageProps}>
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
}
