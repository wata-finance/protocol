import { BigNumber } from 'bignumber.js';
import { PoolData, UserData } from '../../helps/types';

export const calcUnclaimedBalance = (
  balanceBefore: BigNumber,
  poolSumPerTokenAfter: BigNumber,
  poolRewardPerToken: BigNumber,
  userSumPerTokenBefore: BigNumber,
  userUnclaimedRewardBefore: BigNumber
) => {
  return balanceBefore
    .multipliedBy(poolSumPerTokenAfter.plus(poolRewardPerToken).minus(userSumPerTokenBefore))
    .div(1e18)
    .plus(userUnclaimedRewardBefore);
};

export const calcUserIncomeEarn = (
  balance: BigNumber,
  incomePerToken: BigNumber,
  userIncomePerTokenPaid: BigNumber,
  incomeBefore: BigNumber
) => {
  return balance.multipliedBy(incomePerToken.minus(userIncomePerTokenPaid)).plus(incomeBefore);
};

export const calRewardPerToken = (
  currentRewardAmount: BigNumber,
  poolDataBefore: PoolData,
  poolDataAfter: PoolData,
  txTimestamp: BigNumber,
  isUser = true
) => {
  if (txTimestamp <= poolDataBefore.startMiningTime || poolDataBefore.totalSupply.eq(0)) {
    return new BigNumber(0);
  }
  if (isUser) return new BigNumber(0);
  let startTime = poolDataBefore.rewardLastUpdateTime;
  let endTime = txTimestamp;

  if (startTime.eq(0)) startTime = poolDataBefore.startMiningTime;
  if (startTime.lt(poolDataBefore.curPeriodStart)) startTime = poolDataBefore.curPeriodStart;
  if (endTime.gt(poolDataBefore.curPeriodEnd)) endTime = poolDataBefore.curPeriodEnd;
  if (
    startTime.lt(endTime) &&
    startTime.gte(poolDataBefore.curPeriodStart) &&
    endTime.lte(poolDataBefore.curPeriodEnd)
  ) {
    const curRewardAmount = currentRewardAmount
      .multipliedBy(poolDataBefore.totalSupply)
      .div(poolDataBefore.MLTCTotalSupply);
    return curRewardAmount
      .multipliedBy(1e18)
      .multipliedBy(endTime.minus(startTime))
      .div(poolDataBefore.totalSupply)
      .div(poolDataBefore.curPeriodEnd.minus(poolDataBefore.curPeriodStart));
  }
  return new BigNumber(0);
};

export const calcSumPerTokenPoolData = (
  txTimestamp: BigNumber,
  poolDataBefore: PoolData,
  poolDataAfter: PoolData
) => {
  let sumHLTCPerToken;
  let sumHPTPerToken;
  sumHLTCPerToken = new BigNumber(
    poolDataBefore.sumHLTCPerToken.plus(
      calRewardPerToken(
        poolDataBefore.curPeriodHLTC,
        poolDataBefore,
        poolDataAfter,
        txTimestamp,
        false
      )
    )
  );
  sumHPTPerToken = new BigNumber(
    poolDataBefore.sumHPTPerToken.plus(
      calRewardPerToken(
        poolDataBefore.curPeriodHPT,
        poolDataBefore,
        poolDataAfter,
        txTimestamp,
        false
      )
    )
  );
  return { sumHLTCPerToken, sumHPTPerToken };
};

export const calcUserUnclaimed = (
  poolDataBefore: PoolData,
  poolDataAfter: PoolData,
  txTimestamp: BigNumber,
  userDataBefore: UserData
) => {
  let userUnclaimedHLTC;
  let userUnclaimedHPT;
  const hLTCRewardPerToken = calRewardPerToken(
    poolDataBefore.curPeriodHLTC,
    poolDataBefore,
    poolDataAfter,
    txTimestamp
  );

  userUnclaimedHLTC = calcUnclaimedBalance(
    userDataBefore.balance,
    poolDataAfter.sumHLTCPerToken,
    hLTCRewardPerToken,
    userDataBefore.userSumHLTCPerToken,
    userDataBefore.userUnclaimedHLTC
  );

  const hPTRewardPerToken = calRewardPerToken(
    poolDataBefore.curPeriodHLTC,
    poolDataBefore,
    poolDataAfter,
    txTimestamp
  );
  userUnclaimedHPT = calcUnclaimedBalance(
    userDataBefore.balance,
    poolDataAfter.sumHPTPerToken,
    hPTRewardPerToken,
    userDataBefore.userSumHPTPerToken,
    userDataBefore.userUnclaimedHPT
  );
  return {
    userUnclaimedHLTC,
    userUnclaimedHPT,
  };
};

export const calLpRewardPerToken = (
  currentRewardAmount: BigNumber,
  poolDataBefore: PoolData,
  poolDataAfter: PoolData,
  txTimestamp: BigNumber,
  isUser = true
) => {
  if (txTimestamp <= poolDataBefore.startMiningTime || poolDataBefore.totalSupply.eq(0)) {
    return new BigNumber(0);
  }
  if (isUser) return new BigNumber(0);
  let startTime = poolDataBefore.rewardLastUpdateTime;
  let endTime = txTimestamp;
  if (startTime.eq(0)) startTime = poolDataAfter.startMiningTime;
  if (startTime.lt(poolDataAfter.curPeriodStart)) startTime = poolDataAfter.curPeriodStart;
  if (endTime.gt(poolDataAfter.curPeriodEnd)) endTime = poolDataAfter.curPeriodEnd;
  if (startTime.gte(poolDataAfter.curPeriodStart) && endTime.lte(poolDataAfter.curPeriodEnd)) {
    return currentRewardAmount
      .multipliedBy(poolDataBefore.MLTCTotalSupply.minus(poolDataBefore.StakingTotalSupply))
      .div(poolDataBefore.MLTCTotalSupply)
      .multipliedBy(1e18)
      .multipliedBy(endTime.minus(startTime))
      .div(poolDataBefore.totalSupply)
      .div(poolDataAfter.curPeriodEnd.minus(poolDataAfter.curPeriodStart));
  }
  return new BigNumber(0);
};

export const calcLpSumPerTokenPoolData = (
  txTimestamp: BigNumber,
  poolDataBefore: PoolData,
  poolDataAfter: PoolData
) => {
  let sumHLTCPerToken;
  let sumHPTPerToken;
  sumHLTCPerToken = new BigNumber(
    poolDataBefore.sumHLTCPerToken.plus(
      calLpRewardPerToken(
        poolDataBefore.curPeriodHLTC,
        poolDataBefore,
        poolDataAfter,
        txTimestamp,
        false
      )
    )
  );
  sumHPTPerToken = new BigNumber(
    poolDataBefore.sumHPTPerToken.plus(
      calLpRewardPerToken(
        poolDataBefore.curPeriodHPT,
        poolDataBefore,
        poolDataAfter,
        txTimestamp,
        false
      )
    )
  );
  return { sumHLTCPerToken, sumHPTPerToken };
};

export const calcLpUserUnclaimed = (
  poolDataBefore: PoolData,
  poolDataAfter: PoolData,
  txTimestamp: BigNumber,
  userDataBefore: UserData
) => {
  let userUnclaimedHLTC;
  let userUnclaimedHPT;
  const hLTCRewardPerToken = calLpRewardPerToken(
    poolDataBefore.curPeriodHLTC,
    poolDataBefore,
    poolDataAfter,
    txTimestamp
  );

  userUnclaimedHLTC = calcUnclaimedBalance(
    userDataBefore.balance,
    poolDataAfter.sumHLTCPerToken,
    hLTCRewardPerToken,
    userDataBefore.userSumHLTCPerToken,
    userDataBefore.userUnclaimedHLTC
  );

  const hPTRewardPerToken = calLpRewardPerToken(
    poolDataBefore.curPeriodHPT,
    poolDataBefore,
    poolDataAfter,
    txTimestamp
  );
  userUnclaimedHPT = calcUnclaimedBalance(
    userDataBefore.balance,
    poolDataAfter.sumHPTPerToken,
    hPTRewardPerToken,
    userDataBefore.userSumHPTPerToken,
    userDataBefore.userUnclaimedHPT
  );
  return {
    userUnclaimedHLTC,
    userUnclaimedHPT,
  };
};
