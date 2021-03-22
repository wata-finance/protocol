import { BigNumber } from 'bignumber.js';
import { PoolData, UserData } from '../../../helps/types';
import { calcUnclaimedBalance, calRewardPerToken } from '../calculations';

export const mLTCStakingExpectMLTCPoolDataAfterClaimed = async (
  poolData: PoolData,
  poolDataAfter: PoolData,
  txTimestamp: BigNumber
) => {
  const expectPoolData = <PoolData>{};
  expectPoolData.totalSupply = poolData.totalSupply;
  expectPoolData.rewardLastUpdateTime = txTimestamp;

  expectPoolData.curPeriodHLTC = poolData.curPeriodHLTC;
  expectPoolData.curPeriodHPT = poolData.curPeriodHPT;
  expectPoolData.curPeriodStart = poolData.curPeriodStart;
  expectPoolData.curPeriodEnd = poolData.curPeriodEnd;
  expectPoolData.VaultTotalRewardHLTC = poolData.VaultTotalRewardHLTC;
  expectPoolData.VaultTotalRewardHPT = poolData.VaultTotalRewardHPT;

  const sumHLTCPerToken = poolData.sumHLTCPerToken.plus(
    calRewardPerToken(poolData.VaultTotalRewardHLTC, poolData, poolDataAfter, txTimestamp, false)
  );
  const sumHPTPerToken = poolData.sumHPTPerToken.plus(
    calRewardPerToken(poolData.VaultTotalRewardHPT, poolData, poolDataAfter, txTimestamp, false)
  );
  expectPoolData.sumHLTCPerToken = new BigNumber(sumHLTCPerToken);
  expectPoolData.sumHPTPerToken = new BigNumber(sumHPTPerToken);
  return expectPoolData;
};

export const mLTCStakingExpectMLTCUserDataAfterClaimed = async (
  userData: UserData,
  poolData: PoolData,
  poolDataAfter: PoolData,
  txTimestamp: BigNumber
) => {
  const expectUserData = <UserData>{};

  expectUserData.balance = userData.balance;
  expectUserData.userSumHLTCPerToken = userData.userSumHLTCPerToken;
  expectUserData.userSumHPTPerToken = userData.userSumHPTPerToken;

  expectUserData.userUnclaimedHLTC = userData.userUnclaimedHLTC;
  expectUserData.userUnclaimedHPT = userData.userUnclaimedHPT;

  const sumHLTCPerToken = poolData.sumHLTCPerToken.plus(
    calRewardPerToken(poolData.VaultTotalRewardHLTC, poolData, poolDataAfter, txTimestamp, false)
  );
  const sumHPTPerToken = poolData.sumHPTPerToken.plus(
    calRewardPerToken(poolData.VaultTotalRewardHPT, poolData, poolDataAfter, txTimestamp, false)
  );

  expectUserData.userSumHLTCPerToken = new BigNumber(sumHLTCPerToken);
  expectUserData.userSumHPTPerToken = new BigNumber(sumHPTPerToken);
  expectUserData.userUnclaimedHLTC = new BigNumber(
    userData.userUnclaimedHLTC.minus(userData.userUnclaimedHLTC)
  );
  expectUserData.userUnclaimedHPT = new BigNumber(
    userData.userUnclaimedHLTC.minus(userData.userUnclaimedHLTC)
  );
  return expectUserData;
};
