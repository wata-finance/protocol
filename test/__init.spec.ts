import { Signer } from 'ethers';
import rawHRE from 'hardhat';
import { getEthSigners, getFirstSigner } from '../helps/getter';
import { initializeMakeSuite } from './utils/make-suite';
import { deployMintableERC20 } from '../helps/mocks';
import { loadConfig } from '../helps/utils';
import { getAddressByName } from '../helps/file';
import { MockToken } from '../helps/types';

export const deployMockToken = async () => {
  for (const tokenSymbol of Object.keys(MockToken)) {
    const token = MockToken[tokenSymbol];
    await deployMintableERC20(tokenSymbol, token.decimals);
  }
};
export const buildTestEnv = async (deployer: Signer, secondWallet: Signer) => {
  console.time('setup');
  await rawHRE.run('set-HRE');
  await deployMockToken();
  const { LpStakingToken, MLTC } = loadConfig();

  LpStakingToken.hardhat = await getAddressByName(MockToken.MLTCUSDTLp.symbol);
  MLTC.hardhat.HLTC = await getAddressByName(MockToken.HLTC.symbol);
  MLTC.hardhat.HPT = await getAddressByName(MockToken.HPT.symbol);
  MLTC.hardhat.minter = (await getFirstSigner()).address;
  MLTC.hardhat.owner = (await getFirstSigner()).address;
  console.log('-----Deploy address provider...');
  await rawHRE.run('wata:deploy-address-provider');

  console.log('-----Deploy MLTC...');
  await rawHRE.run('wata:MLTC');

  console.log('-----Deploy Staking...');
  await rawHRE.run('wata:Staking');

  console.log('-----Deploy LpStaking...');
  await rawHRE.run('wata:LpStaking');

  console.log('-----Deploy Vault...');
  await rawHRE.run('wata:Vault');

  console.log('-----Set Proxy...');
  await rawHRE.run('wata:setProxy');

  console.log('-----Init contract...');
  await rawHRE.run('wata:init');

  console.log('-----Init LpStaking...');
  await rawHRE.run('wata:init-LpStaking');

  console.timeEnd('setup');
};

before(async () => {
  await rawHRE.run('set-HRE');

  const [deployer, secondWallet] = await getEthSigners();
  console.log('-> Deploy testEnv.....');
  await buildTestEnv(deployer, secondWallet);
  console.log('-> Init testEnv.....');
  await initializeMakeSuite(rawHRE);
});
