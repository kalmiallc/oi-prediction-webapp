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

  async function checkChain() {
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

  async function placeBet(betUuid: string, choiceId: number, amount: number) {
    await checkChain();
    const constractAddress = getContractAddressForEnv(
      ContractType.BET_SHOWCASE,
      process.env.NODE_ENV
    );
    if (!constractAddress) {
      return;
    }

    const value = parseEther(amount.toString());
    await writeContractAsync({
      abi: betAbi,
      address: constractAddress,
      functionName: 'placeBet',
      args: [betUuid, choiceId],
      value,
    });
  }

  return { placeBet, isPending: isPending || isPendingChain };
}
