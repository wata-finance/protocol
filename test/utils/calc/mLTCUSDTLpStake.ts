import { BigNumber } from 'bignumber.js';
import { PoolData, UserData } from '../../../helps/types';
import {
  calcLpSumPerTokenPoolData,
  calcLpUserUnclaimed,
  calcSumPerTokenPoolData,
  calcUnclaimedBalance,
  calcUserUnclaimed,
  calLpRewardPerToken,
} from '../calculations';

export const mLTCUSDLpStakingExpectLpStakingDataAfterStake = async (
  stakeAmount: BigNumber,
  poolDataBefore: PoolData,
  poolDataAfter: PoolData,
  txTimestamp: BigNumber,
  currentTimestamp: BigNumber
) => {
  const expectPoolData = <PoolData>{};
  expectPoolData.totalSupply = poolDataBefore.totalSupply.plus(stakeAmount);
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

export const mLTCUSDTLpStakingExpectLpStakingUserDataAfterStake = async (
  stakeAmount: BigNumber,
  poolDataBefore: PoolData,
  poolDataAfter: PoolData,
  userDataBefore: UserData,
  txTimestamp: BigNumber
) => {
  const expectUserData = <UserData>{};

  expectUserData.balance = userDataBefore.balance.plus(stakeAmount);
  expectUserData.userSumHLTCPerToken = poolDataAfter.sumHLTCPerToken;
  expectUserData.userSumHPTPerToken = poolDataAfter.sumHPTPerToken;

  const { userUnclaimedHLTC, userUnclaimedHPT } = calcLpUserUnclaimed(
    poolDataBefore,
    poolDataAfter,
    txTimestamp,
    userDataBefore
  );
  expectUserData.userUnclaimedHLTC = userUnclaimedHLTC;
  expectUserData.userUnclaimedHPT = userUnclaimedHPT;
  return expectUserData;
};
