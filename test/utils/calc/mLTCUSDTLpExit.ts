import { BigNumber } from 'bignumber.js';
import { PoolData, UserData } from '../../../helps/types';
import {
  calcLpSumPerTokenPoolData,
  calcSumPerTokenPoolData,
  calcUnclaimedBalance,
  calcUserUnclaimed,
  calRewardPerToken,
} from '../calculations';

export const mLTCUSDLpStakingExpectLpStakingDataAfterExit = async (
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

  const { sumHLTCPerToken, sumHPTPerToken } = calcLpSumPerTokenPoolData(
    txTimestamp,
    poolDataBefore,
    poolDataAfter
  );
  expectPoolData.sumHPTPerToken = sumHPTPerToken;
  expectPoolData.sumHLTCPerToken = sumHLTCPerToken;
  return expectPoolData;
};

export const mLTCUSDLpStakingExpectLpStakingUserDataAfterExit = async (
  poolDataBefore: PoolData,
  poolDataAfter: PoolData,
  userDataBefore: UserData,
  txTimestamp: BigNumber,
  currentTimestamp: BigNumber
) => {
  const expectUserData = <UserData>{};

  expectUserData.balance = new BigNumber(0);
  const { sumHLTCPerToken, sumHPTPerToken } = calcLpSumPerTokenPoolData(
    txTimestamp,
    poolDataBefore,
    poolDataAfter
  );
  expectUserData.userSumHLTCPerToken = sumHLTCPerToken;
  expectUserData.userSumHPTPerToken = sumHPTPerToken;

  expectUserData.userUnclaimedHLTC = new BigNumber(0);
  expectUserData.userUnclaimedHPT = new BigNumber(0);
  return expectUserData;
};
