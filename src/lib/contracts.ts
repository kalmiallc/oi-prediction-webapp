import { OIAbi, betAbi } from './abi';

export const ContractType = {
  BET_SHOWCASE: 'bet_showcase',
  OI_TOKEN: 'oi_token',
};

function ContractTemplate(
  abi: any[],
  address: `0x${string}`,
  devAddress: `0x${string}`,
  additionalGas = ''
) {
  return {
    abi,
    address,
    devAddress,
    additionalGas,
  };
}

const Contracts = {
  [ContractType.BET_SHOWCASE]: ContractTemplate(
    betAbi,
    '0x91fDab8AadcEdA5FAb8A9a6b8760086Ac7a4D93f', // prod
    '0x91fDab8AadcEdA5FAb8A9a6b8760086Ac7a4D93f' // dev
  ),
  [ContractType.OI_TOKEN]: ContractTemplate(
    OIAbi,
    '0x42B1951dD949D76B4199dB7B85eF35Ea8C05aF0b', // prod
    '0x42B1951dD949D76B4199dB7B85eF35Ea8C05aF0b' // dev
  ),
};

export function getContractAddressForEnv(type = ContractType.BET_SHOWCASE, env = 'production') {
  if (env === 'development' && Contracts[type].devAddress) {
    return Contracts[type].devAddress;
  }

  if (Contracts[type].address && env === 'production') {
    return Contracts[type].address;
  }
  return Contracts[type].address;
}

export default Contracts;
