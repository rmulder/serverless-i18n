import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Error from "next/error";
import { getDisplayName } from "next/dist/next-server/lib/utils";
import { isLocale, Locale } from "../translations/types";
import { LocaleProvider } from "../context/LocaleContext";
import { getInitialLocale } from "../translations/getInitialLocale";

interface LangProps {
  locale?: Locale;
}

const WithLocale = (WrappedPage: NextPage<any>) => {
  const WithLocale: NextPage<any, LangProps> = ({
    locale = "de",
    ...pageProps
  }) => {
    const { asPath, query, ...rest } = useRouter();

    React.useEffect(() => {
      if (query && query.lang) {
        /**
         * Query will be undefined intially, and if we directly visit a route, e.g. /artist,
         * that field "artist" would be used as lang parameter
         * Therefore, in order to properly detect those paths, check if the language segment
         * actually is one of the supported languages, else use it as path.
         **/

        if (!isLocale(query.lang as string)) {
          window.location.replace(`/${getInitialLocale()}${asPath}`);
        }
      }
    }, [asPath, query, rest]);

    if (!locale) {
      return <Error statusCode={404} />;
    }
    return (
      <LocaleProvider lang={locale}>
        <WrappedPage {...pageProps} />
      </LocaleProvider>
    );
  };

  /*
  WithLocale.getInitialProps = async ctx => {
    let pageProps = {}
    if (WrappedPage.getInitialProps) {
      pageProps = await WrappedPage.getInitialProps(ctx)
    }
    if (typeof ctx.query.lang !== 'string' || !isLocale(ctx.query.lang)) {
      return { ...pageProps, locale: undefined }
    }
    return { ...pageProps, locale: ctx.query.lang }
  }
  */

  WithLocale.displayName = `withLang(${getDisplayName(WrappedPage)})`;

  return WithLocale;
};

export default WithLocale;