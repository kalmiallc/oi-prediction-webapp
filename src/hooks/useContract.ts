import { parseEther } from 'viem';
import { useAccount, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { ContractType, getContractAddressForEnv } from '../lib/contracts';
import { betAbi } from '../lib/abi';
import { toast } from 'sonner';
import { flareTestnet, songbird } from 'viem/chains';
import { useEffect } from 'react';
import { useGlobalContext } from '../contexts/global';

export default function useContract() {
  const { data: hash, writeContractAsync, isPending } = useWriteContract();
  const { address, chainId } = useAccount();
  const { switchChainAsync, isPending: isPendingChain } = useSwitchChain();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });
  const { loadBets } = useGlobalContext();

  async function check() {
    if (!address) {
      toast.error('Please connect wallet');
      return false;
    }
    if (!chainId) {
      toast.error('Please connect the wallet to the required chain');
    } else {
      const requiredChainId = flareTestnet.id;
      // process.env.NODE_ENV === 'production' ? songbird.id : flareTestnet.id;

      if (chainId !== requiredChainId) {
        toast.warning('Please connect the wallet to the required chain');
        await switchChainAsync({ chainId: requiredChainId });
        return false;
      }
    }
  }

  const contractAddress = getContractAddressForEnv(ContractType.BET_SHOWCASE, process.env.NODE_ENV);

  async function placeBet(betUuid: string, choiceId: number, amount: number) {
    await check();
    if (!contractAddress) {
      return;
    }

    const value = parseEther(amount.toString());
    const tx = await writeContractAsync({
      abi: betAbi,
      address: contractAddress,
      functionName: 'placeBet',
      args: [betUuid, choiceId],
      value,
    });
    tx;
  }

  async function claimBet(betId: bigint) {
    await check();
    if (!contractAddress) {
      return;
    }

    await writeContractAsync({
      abi: betAbi,
      address: contractAddress,
      functionName: 'claimWinnings',
      args: [betId],
    });
  }

  useEffect(() => {
    loadBets();
  }, [isConfirmed]);

  return { placeBet, claimBet, isPending: isPending || isPendingChain };
}
