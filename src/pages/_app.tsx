import '@/assets/main.css';
import type { AppProps } from 'next/app';
import BaseLayout from '@/components/layouts/BaseLayout';
import { ThemeProvider, createTheme } from '@mui/material';
import { WagmiProvider } from 'wagmi';
import { defaultWagmiConfig } from '@web3modal/wagmi';
import { flareTestnet, songbird, songbirdTestnet } from 'viem/chains';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Roboto } from 'next/font/google';
import { GlobalProvider } from '@/contexts/global';
import Head from 'next/head';

const fontRoboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const queryClient = new QueryClient();

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;

// TODO: change prod to songbird process.env.NODE_ENV === 'production' ? songbird : flareTestnet
const chains = [flareTestnet] as const;

const metadataW = {
  name: 'Flare Bet',
  description: 'Flare Bet App',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata: metadataW,
});

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

createWeb3Modal({
  wagmiConfig,
  projectId,
  enableOnramp: false,
  enableAnalytics: false,
  themeVariables: {
    '--w3m-font-family': 'Roboto, sans-serif',
    '--w3m-accent': '#D9205A',
    '--w3m-color-mix': '#FFECF2',
    '--w3m-color-mix-strength': 50,
  },
  themeMode: 'light',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Flare Bet</title>
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
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
          <GlobalProvider>
            <ReactQueryDevtools initialIsOpen={false} />
            <ThemeProvider theme={theme}>
              <BaseLayout className="font-sans">
                <Component {...pageProps} />
              </BaseLayout>
            </ThemeProvider>
          </GlobalProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </>
  );
}
