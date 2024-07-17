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
  '0xcec1147b494d47F33B27b2F553c37526a4D3f0bb', // prod
  '0xcec1147b494d47F33B27b2F553c37526a4D3f0bb' // dev
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
