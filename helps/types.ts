import { BigNumber } from 'bignumber.js';

export enum ContractName {
  AddressProvider = 'AddressProvider',
  MLTC = 'MLTC',
  MLTCImpl = 'MLTCImpl',
  MLTCProxy = 'MLTCProxy',
  Vault = 'Vault',
  VaultImpl = 'VaultImpl',
  VaultProxy = 'VaultProxy',
  Staking = 'Staking',
  StakingImpl = 'StakingImpl',
  StakingProxy = 'StakingProxy',
  LpStaking = 'LpStaking',
  LpStakingImpl = 'LpStakingImpl',
  LpStakingProxy = 'LpStakingProxy',
  Test = 'Test',
}

export enum MockContractName {
  MintableERC20 = 'MintableERC20',
  MockMLTC = 'MockMLTC',
  MockVault = 'MockVault',
  MockStaking = 'MockStaking',
  MockLpStaking = 'MockLpStaking',
}

export enum EthNetwork {
  hardhat = 'hardhat',
  hecoTest = 'hecoTest',
  hecoMain = 'hecoMain',
  bscTest = 'bscTest',
  bscMain = 'bscMain',
}
export const MockToken = {
  MLTCUSDTLp: {
    name: 'MLTCUSDTLp',
    symbol: 'MLTCUSDTLp',
    decimals: '18',
  },
  HLTC: {
    name: 'HLTC',
    symbol: 'HLTC',
    decimals: '18',
  },
  HDOGE: {
    name: 'HDOGE',
    symbol: 'HDOGE',
    decimals: '18',
  },
  HPT: {
    name: 'HPT',
    symbol: 'HPT',
    decimals: '18',
  },
};

export interface PoolData {
  startMiningTime: BigNumber;
  totalSupply: BigNumber;
  MLTCTotalSupply: BigNumber;
  StakingTotalSupply: BigNumber;

  rewardLastUpdateTime: BigNumber;

  curPeriodStart: BigNumber;
  curPeriodEnd: BigNumber;

  sumHLTCPerToken: BigNumber;
  curPeriodHLTC: BigNumber;

  sumHPTPerToken: BigNumber;
  curPeriodHPT: BigNumber;

  VaultTotalRewardHLTC: BigNumber;
  VaultTotalRewardHPT: BigNumber;
}

export interface MLTCPoolData extends PoolData {}
export interface MLTCUSDTPoolData extends PoolData {}

export interface UserData {
  balance: BigNumber;
  userSumHLTCPerToken: BigNumber;
  userUnclaimedHLTC: BigNumber;

  userSumHPTPerToken: BigNumber;
  userUnclaimedHPT: BigNumber;
}
