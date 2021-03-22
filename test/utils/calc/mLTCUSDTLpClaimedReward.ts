import { BigNumber } from 'bignumber.js';
import { PoolData, UserData } from '../../../helps/types';
import {
  calcLpSumPerTokenPoolData,
  calcUnclaimedBalance,
  calLpRewardPerToken,
  calRewardPerToken,
} from '../calculations';

export const mLTCUSDLpStakingExpectLpStakingDataAfterClaimReward = async (
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

export const mLTCUSDLpStakingExpectLpStakingUserDataAfterClaimReward = async (
  poolDataBefore: PoolData,
  poolDataAfter: PoolData,
  userDataBefore: UserData,
  txTimestamp: BigNumber
) => {
  const expectUserData = <UserData>{};

  expectUserData.balance = userDataBefore.balance;
  expectUserData.userSumHLTCPerToken = userDataBefore.userSumHLTCPerToken;
  expectUserData.userSumHPTPerToken = userDataBefore.userSumHPTPerToken;

  expectUserData.userUnclaimedHLTC = userDataBefore.userUnclaimedHLTC;
  expectUserData.userUnclaimedHPT = userDataBefore.userUnclaimedHPT;

  const { sumHLTCPerToken, sumHPTPerToken } = calcLpSumPerTokenPoolData(
    txTimestamp,
    poolDataBefore,
    poolDataAfter
  );

  expectUserData.userSumHLTCPerToken = sumHLTCPerToken;
  expectUserData.userSumHPTPerToken = sumHPTPerToken;
  expectUserData.userUnclaimedHLTC = new BigNumber(
    userDataBefore.userUnclaimedHLTC.minus(userDataBefore.userUnclaimedHLTC)
  );
  expectUserData.userUnclaimedHPT = new BigNumber(
    userDataBefore.userUnclaimedHPT.minus(userDataBefore.userUnclaimedHPT)
  );
  return expectUserData;
};
