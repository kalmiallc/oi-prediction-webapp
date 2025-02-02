import { maxUint256, parseEther } from 'viem';
import { useAccount, useConfig, useSwitchChain, useWriteContract } from 'wagmi';
import { ContractType, getContractAddressForNetwork } from '@/lib/contracts';
import { OIAbi, betAbi } from '@/lib/abi';
import { toast } from 'sonner';
import { songbirdTestnet, songbird } from 'viem/chains';
import { useGlobalContext } from '@/contexts/global';
import { waitForTransactionReceipt } from '@wagmi/core';

export default function useContract() {
  const { writeContractAsync, isPending } = useWriteContract();
  const { address, chainId } = useAccount();
  const { switchChainAsync, isPending: isPendingChain } = useSwitchChain();
  const {
    waitTx,
    reloadAllowance,
    state: { allowance, selectedNetwork },
  } = useGlobalContext();
  const config = useConfig();

  const contract = {
    abi: betAbi,
    address: getContractAddressForNetwork(ContractType.BET_SHOWCASE, selectedNetwork),
    chainId: selectedNetwork,
  };

  const tokenContract = {
    abi: OIAbi,
    address: getContractAddressForNetwork(ContractType.OI_TOKEN, selectedNetwork),
    chainId: selectedNetwork,
  };

  async function check() {
    if (!address) {
      toast.error('Please connect wallet');
      return false;
    }
    if (!chainId) {
      toast.error('Please connect the wallet to the required chain');
      return false;
    } else {
      if (selectedNetwork !== chainId) {
        toast.warning('Please connect the wallet to the required chain');
        await switchChainAsync({ chainId: selectedNetwork });
        return false;
      }
    }
    return true;
  }

  async function checkAllowance() {
    if (!allowance) {
      const hash = await writeContractAsync({
        ...tokenContract,
        functionName: 'approve',
        args: [contract.address, maxUint256],
      });
      await waitForTransactionReceipt(config, { hash });
      reloadAllowance();
    }
    return true;
  }

  async function placeBet(betUuid: string, choiceId: number, amount: number) {
    if (!(await check()) || !contract.address || !(await checkAllowance())) {
      return;
    }

    const value = parseEther(amount.toString());
    const hash = await writeContractAsync({
      ...contract,
      functionName: 'placeBet',
      args: [betUuid, choiceId, value],
    });
    waitTx(hash, 'placedBet');

    return hash;
  }

  async function claimBet(betId: bigint) {
    if (!(await check()) || !contract.address) {
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
    if (!(await check()) || !contract.address) {
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
    check,
    placeBet,
    claimBet,
    refundBet,
    isPending: isPending || isPendingChain,
  };
}
