import Head from "next/head";
import { ReactNode } from "react";

interface MainLayoutProps {
  pageTitle: string;
  children: ReactNode;
}

const MainLayout = ({ pageTitle, children }: MainLayoutProps) => {
  return (
    <>
      <Head>
        <title>Aurora | {pageTitle}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      {children}
    </>
  );
};

export default MainLayout;
