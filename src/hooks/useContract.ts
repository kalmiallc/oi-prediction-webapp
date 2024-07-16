import { parseEther } from 'viem';
import { useAccount, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { getContractAddressForEnv } from '@/lib/contracts';
import { betAbi } from '@/lib/abi';
import { toast } from 'sonner';
import { flareTestnet } from 'viem/chains';

export default function useContract() {
  const { data: hash, writeContractAsync, isPending } = useWriteContract();
  const { address, chainId } = useAccount();
  const { switchChainAsync, isPending: isPendingChain } = useSwitchChain();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

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

  const contractAddress = getContractAddressForEnv(process.env.NODE_ENV);

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

  return {
    placeBet,
    claimBet,
    isPending: isPending || isPendingChain,
    transactionConfirm: isConfirmed,
  };
}
