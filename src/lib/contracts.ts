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
    '0x30882A3d7562Bd0cbbafc2ec6C491B5A30b18895', // prod
    '0x30882A3d7562Bd0cbbafc2ec6C491B5A30b18895' // dev
  ),
  [ContractType.OI_TOKEN]: ContractTemplate(
    OIAbi,
    '0x21bb744BCc53d78b904c2E374EC460C086908537', // prod
    '0x21bb744BCc53d78b904c2E374EC460C086908537' // dev
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
