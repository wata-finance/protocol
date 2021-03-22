import { BigNumber } from 'bignumber.js';
import { PoolData, UserData } from '../../../helps/types';
import {
  calcLpSumPerTokenPoolData,
  calcLpUserUnclaimed,
  calcSumPerTokenPoolData,
  calcUnclaimedBalance,
  calcUserUnclaimed,
  calRewardPerToken,
} from '../calculations';

export const mLTCStakingExpectMLTCPoolDataAfterWithdraw = async (
  withdrawAmount: BigNumber,
  poolDataBefore: PoolData,
  poolDataAfter: PoolData,
  txTimestamp: BigNumber,
  currentTimestamp: BigNumber
) => {
  const expectPoolData = <PoolData>{};
  expectPoolData.totalSupply = poolDataBefore.totalSupply.minus(withdrawAmount);
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

export const mLTCStakingExpectMLTCUSDTPoolDataAfterWithdraw = async (
  withdrawAmount: BigNumber,
  poolDataBefore: PoolData,
  poolDataAfter: PoolData,
  txTimestamp: BigNumber,
  currentTimestamp: BigNumber
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

export const mLTCStakingExpectMLTCUserDataAfterWithdraw = async (
  withdrawAmount: BigNumber,
  poolDataBefore: PoolData,
  poolDataAfter: PoolData,
  userDataBefore: UserData,
  txTimestamp: BigNumber
) => {
  const expectUserData = <UserData>{};

  expectUserData.balance = userDataBefore.balance.minus(withdrawAmount);
  expectUserData.userSumHLTCPerToken = poolDataAfter.sumHLTCPerToken;
  expectUserData.userSumHPTPerToken = poolDataAfter.sumHPTPerToken;

  const { userUnclaimedHLTC, userUnclaimedHPT } = calcUserUnclaimed(
    poolDataBefore,
    poolDataAfter,
    txTimestamp,
    userDataBefore
  );
  expectUserData.userUnclaimedHLTC = userUnclaimedHLTC;
  expectUserData.userUnclaimedHPT = userUnclaimedHPT;
  return expectUserData;
};
