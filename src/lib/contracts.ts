import { betAbi } from './abi';

export const ContractType = {
  BET_SHOWCASE: 'bet_showcase',
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
    '0x7eC34DC6f0F6C3939fbE1D0b1041746596495a60', // prod
    '0x7eC34DC6f0F6C3939fbE1D0b1041746596495a60' // dev
  ),
};

export function getContractAddressForEnv(type: string, env = 'production') {
  if (!(type in Contracts)) {
    return undefined;
  }

  if (env === 'development' && Contracts[type].devAddress) {
    return Contracts[type].devAddress;
  }

  if (Contracts[type].address && env === 'production') {
    return Contracts[type].address;
  }
  return Contracts[type].address;
}

export default Contracts;
