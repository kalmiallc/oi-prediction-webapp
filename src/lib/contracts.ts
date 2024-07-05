import { betAbi } from './abi';

export const ContractType = {
  BET_SHOWCASE: 'bet_showcase',
};

function ContractTemplate(
  abi: any[],
  address: `0x${string}`,
  stgAddress: `0x${string}`,
  devAddress: `0x${string}`,
  additionalGas = ''
) {
  return {
    abi,
    address,
    stgAddress,
    devAddress,
    additionalGas,
  };
}

const Contracts = {
  [ContractType.BET_SHOWCASE]: ContractTemplate(
    betAbi,
    '0xEbc2388AB1Be3A972d6e919B5d13E9cE012E1D00', // prod
    '0xEbc2388AB1Be3A972d6e919B5d13E9cE012E1D00', // stg
    '0xEbc2388AB1Be3A972d6e919B5d13E9cE012E1D00' // dev
  ),
};

export function getContractAddressForEnv(type: string, env = 'production') {
  if (!(type in Contracts)) {
    return undefined;
  }

  if (env === 'development' && Contracts[type].devAddress) {
    return Contracts[type].devAddress;
  }

  if (Contracts[type].stgAddress && env === 'staging') {
    return Contracts[type].stgAddress;
  }

  if (Contracts[type].address && env === 'production') {
    return Contracts[type].address;
  }
  return Contracts[type].address;
}

export default Contracts;
