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
    '0x8B109F126F5454Edc5662A254933E19250222dBB', // prod
    '0x8B109F126F5454Edc5662A254933E19250222dBB' // dev
  ),
  [ContractType.OI_TOKEN]: ContractTemplate(
    OIAbi,
    '0x436f2E9fa77eBFca331639FB1c72Eadd2fd9fCEB', // prod
    '0x436f2E9fa77eBFca331639FB1c72Eadd2fd9fCEB' // dev
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
