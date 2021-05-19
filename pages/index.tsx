import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { getInitialLocale } from "../translations/getInitialLocale";

const Index: React.FC = () => {
  const router = useRouter();

  React.useEffect(() => {
    window.location.replace(`/${getInitialLocale()}${router.asPath}`);
  });

  return (
    <Head>
      <meta name="robots" content="noindex, nofollow" />
    </Head>
  );
};

export default Index;
