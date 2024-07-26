import { Button, CircularProgress } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { OIAbi } from '../lib/abi';
import { useEffect, useState } from 'react';
import useContract from '../hooks/useContract';
import { toast } from 'sonner';
import { useGlobalContext } from '../contexts/global';
import { ContractType, getContractAddressForNetwork } from '../lib/contracts';

export default function FaucetPage() {
  const { address, isConnected } = useAccount();
  const { check } = useContract();
  const {
    waitTx,
    eventEmitter,
    state: { selectedNetwork },
  } = useGlobalContext();
  const { writeContractAsync } = useWriteContract();
  const [loading, setLoading] = useState(false);
  const [isDefinitelyConnected, setIsDefinitelyConnected] = useState(false);
  const [canMint, setCanMint] = useState(true);

  const contract = {
    address: getContractAddressForNetwork(ContractType.OI_TOKEN, selectedNetwork),
    abi: OIAbi,
    chainId: selectedNetwork,
  };

  const { data, isFetched, refetch } = useReadContract({
    ...contract,
    functionName: 'canMint',
    args: [address],
    query: { enabled: !!address, staleTime: 5 * 60 * 10000 },
  });

  async function claimToken() {
    setLoading(true);
    try {
      if (!(await check())) {
        return;
      }
      const hash = await writeContractAsync({
        ...contract,
        functionName: 'mint',
      });
      waitTx(hash, 'claimedToken');
    } catch (error: any) {
      setLoading(false);
      refetch();
      if (error?.shortMessage) {
        toast.error(error?.shortMessage);
      }
      console.log(error);
    }
  }

  useEffect(() => {
    eventEmitter.on('claimedToken', () => {
      setCanMint(false);
      setLoading(false);
      refetch();
    });
  }, [eventEmitter]);

  useEffect(() => {
    if (isConnected) {
      setIsDefinitelyConnected(true);
    } else {
      setIsDefinitelyConnected(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    if (isFetched) {
      setCanMint(!!data);
    }
  }, [data]);

  return (
    <div className="px-5 lg:px-10 max-w-[1400px] m-auto bg-white pt-4 pb-10 rounded-[24px]">
      <div>
        <h1 className="typo-h1 mb-2">Get Daily OI Coins</h1>
        <p>You can claim 500 coins every day.</p>
      </div>
      <div className="m-auto md:w-fit mt-10">
        {!isDefinitelyConnected ? (
          <div className="connectButton">
            <ConnectButton showBalance={false} label="Connect" />
          </div>
        ) : (
          <div>
            <Button
              disabled={loading || !canMint}
              size="large"
              variant="outlined"
              className="w-full md:w-auto md:px-10"
              onClick={claimToken}
            >
              {loading && <CircularProgress size={12} className="absolute" />}Claim 500 OI Coins
            </Button>
            {!canMint && (
              <p className="text-center text-red text-sm mt-2">Can only claim once per day</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
