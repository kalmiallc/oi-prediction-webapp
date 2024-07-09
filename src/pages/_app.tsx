import '@/assets/main.css';
import type { AppProps } from 'next/app';
import BaseLayout from '../components/layouts/BaseLayout';
import { ThemeProvider, createTheme } from '@mui/material';
import { WagmiProvider } from 'wagmi';
import { defaultWagmiConfig } from '@web3modal/wagmi';
import { flare, flareTestnet } from 'viem/chains';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Roboto } from 'next/font/google';
import { GlobalProvider } from '@/contexts/global';

const fontRoboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const queryClient = new QueryClient();

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;

const chains = [flare, flareTestnet] as const;

const metadata = {
  name: 'Flare Bet',
  description: 'Flare Bet App',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

const theme = createTheme({
  palette: {
    primary: {
      main: '#fb6f00',
    },
    secondary: {
      main: '#edf2ff',
    },
  },
});

createWeb3Modal({
  wagmiConfig,
  projectId,
  enableOnramp: false,
  enableAnalytics: false,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-roboto: ${fontRoboto.style.fontFamily};
        }

        body {
          font-family: ${fontRoboto.style.fontFamily};
        }
      `}</style>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <GlobalProvider>
            <ReactQueryDevtools initialIsOpen={false} />
            <ThemeProvider theme={theme}>
              <BaseLayout className="font-sans">
                <Component {...pageProps} />
              </BaseLayout>
            </ThemeProvider>
          </GlobalProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}
