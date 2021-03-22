import { MockContractName } from './types';
import { HRE, withSave } from './utils';

export const deployMintableERC20 = async (tokenSymbol: string, decimals: string) => {
  const MintableERC20 = await HRE.ethers.getContractFactory(MockContractName.MintableERC20);

  return await withSave(
    await MintableERC20.deploy(tokenSymbol, tokenSymbol, decimals),
    tokenSymbol
  );
};
