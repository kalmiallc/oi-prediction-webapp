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
  '0x93Ff41ac89E20fcbb947324042501B5f9dB6a782', // prod
  '0x93Ff41ac89E20fcbb947324042501B5f9dB6a782' // dev
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
