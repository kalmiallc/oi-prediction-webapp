import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function Home() {
  const { isConnected, address } = useAccount();

  useEffect(() => {
    console.log('Account connected: ', address);
  }, [isConnected]);

  return (
    <div className="flex min-h-full flex-col items-center justify-between p-24">
      <div></div>
    </div>
  );
}
