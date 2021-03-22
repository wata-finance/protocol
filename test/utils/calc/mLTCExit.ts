import { BigNumber } from 'bignumber.js';
import { PoolData, UserData } from '../../../helps/types';
import {
  calcLpSumPerTokenPoolData,
  calcSumPerTokenPoolData,
  calcUnclaimedBalance,
  calcUserUnclaimed,
  calRewardPerToken,
} from '../calculations';

export const mLTCStakingExpectMLTCPoolDataAfterExit = async (
  poolDataBefore: PoolData,
  poolDataAfter: PoolData,
  userDataBefore: UserData,
  txTimestamp: BigNumber,
  currentTimestamp: BigNumber
) => {
  const expectPoolData = <PoolData>{};
  expectPoolData.totalSupply = poolDataBefore.totalSupply.minus(userDataBefore.balance);
  expectPoolData.rewardLastUpdateTime = txTimestamp;

  expectPoolData.curPeriodHLTC = poolDataBefore.curPeriodHLTC;
  expectPoolData.curPeriodHPT = poolDataBefore.curPeriodHPT;
  expectPoolData.curPeriodStart = poolDataBefore.curPeriodStart;
  expectPoolData.curPeriodEnd = poolDataBefore.curPeriodEnd;
  expectPoolData.VaultTotalRewardHLTC = poolDataBefore.VaultTotalRewardHLTC;
  expectPoolData.VaultTotalRewardHPT = poolDataBefore.VaultTotalRewardHPT;

  const { sumHLTCPerToken, sumHPTPerToken } = calcSumPerTokenPoolData(
    txTimestamp,
    poolDataBefore,
    poolDataAfter
  );
  expectPoolData.sumHPTPerToken = sumHPTPerToken;
  expectPoolData.sumHLTCPerToken = sumHLTCPerToken;
  return expectPoolData;
};

export const mLTCStakingExpectMLTCUSDTPoolDataAfterExit = async (
  poolDataBefore: PoolData,
  poolDataAfter: PoolData,
  txTimestamp: BigNumber
) => {
  const expectPoolData = <PoolData>{};
  expectPoolData.totalSupply = poolDataBefore.totalSupply;
  expectPoolData.rewardLastUpdateTime = txTimestamp;

  expectPoolData.curPeriodHLTC = poolDataBefore.curPeriodHLTC;
  expectPoolData.curPeriodHPT = poolDataBefore.curPeriodHPT;
  expectPoolData.curPeriodStart = poolDataBefore.curPeriodStart;
  expectPoolData.curPeriodEnd = poolDataBefore.curPeriodEnd;
  expectPoolData.VaultTotalRewardHLTC = poolDataBefore.VaultTotalRewardHLTC;
  expectPoolData.VaultTotalRewardHPT = poolDataBefore.VaultTotalRewardHPT;

  const { sumHLTCPerToken, sumHPTPerToken } = calcLpSumPerTokenPoolData(
    txTimestamp,
    poolDataBefore,
    poolDataAfter
  );
  expectPoolData.sumHPTPerToken = sumHPTPerToken;
  expectPoolData.sumHLTCPerToken = sumHLTCPerToken;
  return expectPoolData;
};

export const mLTCStakingExpectMLTCUserDataAfterExit = async (poolDataAfter: PoolData) => {
  const expectUserData = <UserData>{};

  expectUserData.balance = new BigNumber(0);
  expectUserData.userSumHLTCPerToken = poolDataAfter.sumHLTCPerToken;
  expectUserData.userSumHPTPerToken = poolDataAfter.sumHPTPerToken;

  expectUserData.userUnclaimedHLTC = new BigNumber(0);
  expectUserData.userUnclaimedHPT = new BigNumber(0);
  return expectUserData;
};
