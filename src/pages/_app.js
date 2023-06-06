import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../createEmotionCache";
import { SessionProvider } from "next-auth/react";
import SimpleReactLightbox from "simple-react-lightbox";
import Layout from "../components/layout/Layout";
// import theme from "../themes/theme";
import Script from "next/script";
import "../styles/normalize.css";
import { red } from "@mui/material/colors";

const clientSideEmotionCache = createEmotionCache();

export const ThemeContext = React.createContext();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const [primaryColor, setPrimaryColor] = useState("#0A435D");
  const [accentColor, setAccentColor] = useState("#4593a7");
  const [backgroundImage, setBackgroundImage] = useState("");

  let theme = createTheme({
    palette: {
      primary: {
        // main: "#556cd6",
        // main: "#873abb",
        main: primaryColor,
      },
      secondary: {
        // main: "#19857b",
        main: accentColor,
      },
      error: {
        main: red.A400,
      },
    },
  });

  theme = responsiveFontSizes(theme);

  const DEBUG = process.env.NODE_ENV == "development" ? true : false;

  useEffect(() => {
    DisableConsoleLog();
  }, []);

  const DisableConsoleLog = () => {
    if (!DEBUG) {
      if (!window.console) window.console = {};
      var methods = ["log", "debug", "warn", "info"];
      for (var i = 0; i < methods.length; i++) {
        console[methods[i]] = function () {};
      }
    }
  };

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <SessionProvider session={pageProps.session}>
          <SimpleReactLightbox>
            <Head>
              <meta name="viewport" content="initial-scale=1, width=device-width" />
              <title>Memoryise</title>
              {/* <link rel="shortcut icon" href="/favicon.ico" /> */}
              {/* <link rel="apple-touch-icon" sizes="57x57" href="/favicons/apple-icon-57x57.png" />
              <link rel="apple-touch-icon" sizes="60x60" href="/favicons/apple-icon-60x60.png" />
              <link rel="apple-touch-icon" sizes="72x72" href="/favicons/apple-icon-72x72.png" />
              <link rel="apple-touch-icon" sizes="76x76" href="/favicons/apple-icon-76x76.png" />
              <link
                rel="apple-touch-icon"
                sizes="114x114"
                href="/favicons/apple-icon-114x114.png"
              />
              <link
                rel="apple-touch-icon"
                sizes="120x120"
                href="/favicons/apple-icon-120x120.png"
              />
              <link
                rel="apple-touch-icon"
                sizes="144x144"
                href="/favicons/apple-icon-144x144.png"
              />
              <link
                rel="apple-touch-icon"
                sizes="152x152"
                href="/favicons/apple-icon-152x152.png"
              />
              <link
                rel="apple-touch-icon"
                sizes="180x180"
                href="/favicons/apple-icon-180x180.png"
              />
              <link
                rel="icon"
                type="image/png"
                sizes="192x192"
                href="/favicons/android-icon-192x192.png"
              />
              <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
              <link rel="icon" type="image/png" sizes="96x96" href="/favicons/favicon-96x96.png" />
              <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
              <link rel="manifest" href="/favicons/manifest.json" /> */}

              {/* <meta name="msapplication-TileColor" content="#ffffff" />
              <meta name="msapplication-TileImage" content="/favicons/ms-icon-144x144.png" /> */}
              {/* <meta name="theme-color" content="#ffffff" /> */}

              <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
              <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
              <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
              <link rel="manifest" href="/favicons/site.webmanifest" />
            </Head>

            <CssBaseline />
            <ThemeContext.Provider
              value={{
                primaryColor,
                accentColor,
                setPrimaryColor,
                setAccentColor,
                backgroundImage,
                setBackgroundImage,
              }}
            >
              <Layout>
                <Script src="https://widget.cloudinary.com/v2.0/global/all.js"></Script>
                <Component {...pageProps} />
              </Layout>
            </ThemeContext.Provider>
          </SimpleReactLightbox>
        </SessionProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
