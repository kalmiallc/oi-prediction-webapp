import '@/assets/main.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import BaseLayout from '@/components/layouts/BaseLayout';
import { ThemeProvider, createTheme } from '@mui/material';
import { WagmiProvider } from 'wagmi';
import { songbirdTestnet, songbird } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Roboto } from 'next/font/google';
import { GlobalProvider } from '@/contexts/global';
import Head from 'next/head';
import { RainbowKitProvider, getDefaultConfig, lightTheme } from '@rainbow-me/rainbowkit';

const fontRoboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const queryClient = new QueryClient();

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;

// TODO: change prod to songbird process.env.NODE_ENV === 'production' ? songbird : songbirdTestnet
const chains = [songbirdTestnet] as const;

const theme = createTheme({
  typography: {
    fontFamily: fontRoboto.style.fontFamily,
  },
  palette: {
    primary: {
      main: '#D9205A',
    },
    secondary: {
      main: '#FF95B7',
    },
  },
});

const wagmiConfig = getDefaultConfig({
  appName: 'Flare Bet App',
  appIcon: '/images/favicon-32x32.png',
  projectId,
  chains,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>2024 Olympics Prediction Market</title>
        <link rel="icon" type="image/png" sizes="32x32" href="/images/paris-icon-32.png" />
      </Head>
      <style jsx global>{`
        :root {
          --font-roboto: ${fontRoboto.style.fontFamily};
        }

        body {
          font-family: ${fontRoboto.style.fontFamily};
        }
      `}</style>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <RainbowKitProvider
            modalSize="compact"
            theme={lightTheme({
              accentColor: '#D9205A',
            })}
          >
            <GlobalProvider>
              <ReactQueryDevtools initialIsOpen={false} />
              <ThemeProvider theme={theme}>
                <BaseLayout className="font-sans">
                  <Component {...pageProps} />
                </BaseLayout>
              </ThemeProvider>
            </GlobalProvider>
          </RainbowKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </>
  );
}
