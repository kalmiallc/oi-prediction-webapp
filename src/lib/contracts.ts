import { betAbi } from './abi';

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

const Contract = ContractTemplate(
  betAbi,
  '0xbACf59d58719DF9017414da1b7f7752e9648B777', // prod
  '0xbACf59d58719DF9017414da1b7f7752e9648B777' // dev
);
export function getContractAddressForEnv(env = 'production') {
  if (env === 'development' && Contract.devAddress) {
    return Contract.devAddress;
  }

  if (Contract.address && env === 'production') {
    return Contract.address;
  }
  return Contract.address;
}

export default Contract;
