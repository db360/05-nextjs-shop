import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import "../styles/globals.css";

import { AuthProvider, CartProvider, UiProvider } from "../context";

import { CssBaseline, ThemeProvider } from "@mui/material";

import { lightTheme } from "../themes";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <AuthProvider isLoggedIn={false}>
        <CartProvider>
          <UiProvider>
            <ThemeProvider theme={lightTheme}>
              <CssBaseline />
              <Component {...pageProps} />
            </ThemeProvider>
          </UiProvider>
        </CartProvider>
      </AuthProvider>
    </SWRConfig>
  );
}

export default MyApp;
