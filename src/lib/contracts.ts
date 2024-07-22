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
  '0xe5b4C2fcC4389a52cb64F5a6929913b3Bf6926Aa', // prod
  '0xe5b4C2fcC4389a52cb64F5a6929913b3Bf6926Aa' // dev
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
