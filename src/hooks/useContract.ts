import { parseEther } from 'viem';
import { useAccount, useSwitchChain, useWriteContract } from 'wagmi';
import { ContractType, getContractAddressForEnv } from '../lib/contracts';
import { betAbi } from '../lib/abi';
import { toast } from 'sonner';
import { flare, flareTestnet } from 'viem/chains';

export default function useContract() {
  const { writeContractAsync, isPending } = useWriteContract();
  const { address, chainId } = useAccount();
  const { switchChainAsync, isPending: isPendingChain } = useSwitchChain();

  async function check() {
    if (!address) {
      toast.error('Please connect wallet');
      return false;
    }
    if (!chainId) {
      toast.error('Please connect the wallet to the required chain');
    } else {
      const requiredChainId = process.env.NODE_ENV === 'production' ? flare.id : flareTestnet.id;

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
    await writeContractAsync({
      abi: betAbi,
      address: contractAddress,
      functionName: 'placeBet',
      args: [betUuid, choiceId],
      value,
    });
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

  return { placeBet, claimBet, isPending: isPending || isPendingChain };
}
