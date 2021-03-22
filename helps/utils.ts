import { Contract, ContractTransaction, ethers } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import BigNumber from 'bignumber.js';
import { insertContract } from './file';
import { EthNetwork, PoolData, UserData } from './types';
import { IParamsPerNetwork, IWataConfig } from '../config/types';
import { WataConfig } from '../config/BaseConfig';
import { getMintableERC20 } from './getter';
import { TestEnv } from '../test/utils/make-suite';
import { _toEscapedUtf8String } from 'ethers/lib/utils';

export let HRE: HardhatRuntimeEnvironment;

export const setHRE = (_HRE: HardhatRuntimeEnvironment) => {
  HRE = _HRE;
};
export const evmSnapshot = async () => await HRE.ethers.provider.send('evm_snapshot', []);
export const evmRevert = async (id: string) => HRE.ethers.provider.send('evm_revert', [id]);

export const increaseTime = async (secondsToIncrease: number) => {
  await HRE.ethers.provider.send('evm_increaseTime', [secondsToIncrease]);
  await HRE.ethers.provider.send('evm_mine', []);
};
export const getConfigByNetwork = <T>(
  network: EthNetwork,
  { hecoMain, hecoTest, hardhat, bscMain, bscTest }: IParamsPerNetwork<T>
) => {
  switch (network) {
    case EthNetwork.hardhat:
      return hardhat;
    case EthNetwork.hecoMain:
      return hecoMain;
    case EthNetwork.hecoTest:
      return hecoTest;
    case EthNetwork.bscMain:
      return bscMain;
    case EthNetwork.bscTest:
      return bscTest;
  }
};
export const waitForTx = async (tx: ContractTransaction) => await tx.wait(1);
export const withSave = async (instance: Contract, contractName: string): Promise<Contract> => {
  await waitForTx(instance.deployTransaction);
  await insertContract(instance, contractName);
  return instance;
};

export const loadConfig = () => {
  return WataConfig;
};

export const timeLatest = async () => {
  const block = await HRE.ethers.provider.getBlock('latest');
  return new BigNumber(block.timestamp);
};

export const convertToCurrencyDecimals = async (tokenAddress: string, amount: string) => {
  const token = await getMintableERC20(tokenAddress);
  let decimals = (await token.decimals()).toString();

  return ethers.utils.parseUnits(amount, decimals);
};

export const getTxTimestamp = async (tx) => {
  return (await HRE.ethers.provider.getBlock(tx.blockNumber)).timestamp;
};

export const getPoolData = async (testEnv: TestEnv, contract: Contract) => {
  const { Vault, MLTC, Staking } = testEnv;
  const poolData = <PoolData>{};
  poolData.totalSupply = new BigNumber((await contract.totalSupply()).toString());
  poolData.rewardLastUpdateTime = new BigNumber((await contract.rewardLastUpdateTime()).toString());

  poolData.curPeriodStart = new BigNumber((await contract.curPeriodStart()).toString());
  poolData.curPeriodEnd = new BigNumber((await contract.curPeriodEnd()).toString());

  poolData.sumHLTCPerToken = new BigNumber((await contract.sumHLTCPerToken()).toString());
  poolData.curPeriodHLTC = new BigNumber((await contract.curPeriodHLTC()).toString());

  poolData.sumHPTPerToken = new BigNumber((await contract.sumHPTPerToken()).toString());
  poolData.curPeriodHPT = new BigNumber((await contract.curPeriodHPT()).toString());

  poolData.VaultTotalRewardHLTC = new BigNumber((await Vault.totalRewardHLTC()).toString());
  poolData.VaultTotalRewardHPT = new BigNumber((await Vault.totalRewardHPT()).toString());
  poolData.startMiningTime = new BigNumber((await contract.startMiningTime()).toString());
  poolData.MLTCTotalSupply = new BigNumber(await (await MLTC.totalSupply()).toString());
  poolData.StakingTotalSupply = new BigNumber((await Staking.totalSupply()).toString());
  return poolData;
};

export const getUserData = async (testEnv: TestEnv, userAddress: string, contract: Contract) => {
  const { Staking } = testEnv;
  const userData = <UserData>{};
  if (contract == Staking) {
    userData.balance = new BigNumber((await contract.mLTCBalances(userAddress)).toString());
  } else {
    userData.balance = new BigNumber((await contract.lpBalances(userAddress)).toString());
  }
  userData.userSumHLTCPerToken = new BigNumber(
    (await contract.userSumHLTCPerToken(userAddress)).toString()
  );
  userData.userUnclaimedHLTC = new BigNumber(
    (await contract.userUnclaimedHLTC(userAddress)).toString()
  );

  userData.userSumHPTPerToken = new BigNumber(
    (await contract.userSumHPTPerToken(userAddress)).toString()
  );
  userData.userUnclaimedHPT = new BigNumber(
    (await contract.userUnclaimedHPT(userAddress)).toString()
  );

  return userData;
};

export const getContractData = async (testEnv: TestEnv, userAddress: string) => {
  const { Staking, LpStaking } = testEnv;
  const [mLTCUserData, mLTCUSDTUserData, mLTCPoolData, mLTCUSDTPoolData] = await Promise.all([
    getUserData(testEnv, userAddress, Staking),
    getUserData(testEnv, userAddress, LpStaking),
    getPoolData(testEnv, Staking),
    getPoolData(testEnv, LpStaking),
  ]);
  return {
    mLTCUserData,
    mLTCUSDTUserData,
    mLTCPoolData,
    mLTCUSDTPoolData,
  };
};
