import { songbird, songbirdTestnet } from 'viem/chains';
import { OIAbi, betAbi } from './abi';

export const ContractType = {
  BET_SHOWCASE: 'bet_showcase',
  OI_TOKEN: 'oi_token',
};

export enum Network {
  main = songbird.id,
  testnet = songbirdTestnet.id,
}

function ContractTemplate(
  abi: any[],
  address: `0x${string}`,
  testnetAddress: `0x${string}`,
  additionalGas = ''
) {
  return {
    abi,
    address,
    testnetAddress,
    additionalGas,
  };
}

const Contracts = {
  [ContractType.BET_SHOWCASE]: ContractTemplate(
    betAbi,
    '0x8445Ff5363e06D650b43C7a4c3eB306Be1491CBE', // main
    '0x30882A3d7562Bd0cbbafc2ec6C491B5A30b18895' // testnet
  ),
  [ContractType.OI_TOKEN]: ContractTemplate(
    OIAbi,
    '0x82AF954d52Bb42F5075c392323D983415fe68672', // main
    '0x21bb744BCc53d78b904c2E374EC460C086908537' // testnet
  ),
};

export function getContractAddressForNetwork(
  type = ContractType.BET_SHOWCASE,
  network = Network.main
) {
  if (network === Network.testnet && Contracts[type].testnetAddress) {
    return Contracts[type].testnetAddress;
  }

  if (Contracts[type].address && network === Network.main) {
    return Contracts[type].address;
  }
  return Contracts[type].address;
}

export default Contracts;
