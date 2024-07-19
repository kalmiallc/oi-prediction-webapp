import { useRef } from 'react';
import { useConfig } from 'wagmi';

export default function useToken() {
  const config = useConfig();
  const chain = config.chains[0];
  return {
    token: chain.nativeCurrency.symbol,
  };
}
