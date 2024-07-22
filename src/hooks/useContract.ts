import { parseEther } from 'viem';
import { useAccount, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { getContractAddressForEnv } from '@/lib/contracts';
import { betAbi } from '@/lib/abi';
import { toast } from 'sonner';
import { songbirdTestnet } from 'viem/chains';
import { useGlobalContext } from '../contexts/global';

export default function useContract() {
  const { writeContractAsync, isPending } = useWriteContract();
  const { address, chainId } = useAccount();
  const { switchChainAsync, isPending: isPendingChain } = useSwitchChain();
  const { waitTx } = useGlobalContext();

  async function check() {
    if (!address) {
      toast.error('Please connect wallet');
      return false;
    }
    if (!chainId) {
      toast.error('Please connect the wallet to the required chain');
    } else {
      const requiredChainId = songbirdTestnet.id;
      // process.env.NODE_ENV === 'production' ? songbird.id : songbirdTestnet.id;

      if (chainId !== requiredChainId) {
        toast.warning('Please connect the wallet to the required chain');
        await switchChainAsync({ chainId: requiredChainId });
        return false;
      }
    }
  }

  const contract = {
    abi: betAbi,
    address: getContractAddressForEnv(process.env.NODE_ENV),
  };

  async function placeBet(betUuid: string, choiceId: number, amount: number) {
    await check();
    if (!contract.address) {
      return;
    }

    const value = parseEther(amount.toString());
    const hash = await writeContractAsync({
      ...contract,
      functionName: 'placeBet',
      args: [betUuid, choiceId],
      value,
    });
    waitTx(hash, 'placedBet');

    return hash;
  }

  async function claimBet(betId: bigint) {
    await check();
    if (!contract.address) {
      return;
    }

    const hash = await writeContractAsync({
      ...contract,
      functionName: 'claimWinnings',
      args: [betId],
    });
    waitTx(hash, 'claimedBet');

    return hash;
  }

  async function refundBet(betId: bigint) {
    await check();
    if (!contract.address) {
      return;
    }

    const hash = await writeContractAsync({
      ...contract,
      functionName: 'refund',
      args: [betId],
    });
    waitTx(hash, 'claimedRefund');

    return hash;
  }

  return {
    placeBet,
    claimBet,
    refundBet,
    isPending: isPending || isPendingChain,
  };
}
