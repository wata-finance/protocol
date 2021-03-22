import { BigNumber } from 'bignumber.js';
import { PoolData } from '../../../helps/types';
import {
  calcLpSumPerTokenPoolData,
  calcSumPerTokenPoolData,
  calRewardPerToken,
} from '../calculations';

export const expectMLTCPoolDataAfterAddNewPeriodReward = (
  hLTCMintAmount: BigNumber,
  hHPTMintAmount: BigNumber,
  endTime: BigNumber,
  poolDataBefore: PoolData,
  poolDataAfter: PoolData,
  txTimestamp: BigNumber
) => {
  const expectPoolData = <PoolData>{};

  expectPoolData.totalSupply = poolDataBefore.totalSupply;
  expectPoolData.rewardLastUpdateTime = txTimestamp;

  expectPoolData.curPeriodStart = txTimestamp;
  expectPoolData.curPeriodEnd = endTime;

  if (poolDataBefore.curPeriodStart < txTimestamp && poolDataBefore.curPeriodEnd > txTimestamp) {
    const factor = 100000000;
    const ratio = poolDataBefore.curPeriodEnd
      .minus(txTimestamp)
      .multipliedBy(factor)
      .div(poolDataBefore.curPeriodEnd.minus(poolDataBefore.curPeriodStart));
    expectPoolData.curPeriodHLTC = poolDataBefore.curPeriodHLTC
      .multipliedBy(ratio)
      .div(factor)
      .plus(hLTCMintAmount);
    expectPoolData.curPeriodHPT = poolDataBefore.curPeriodHPT
      .multipliedBy(ratio)
      .div(factor)
      .plus(hHPTMintAmount);
  } else {
    expectPoolData.curPeriodHLTC = hLTCMintAmount;
    expectPoolData.curPeriodHPT = hHPTMintAmount;
  }

  const { sumHLTCPerToken, sumHPTPerToken } = calcSumPerTokenPoolData(
    txTimestamp,
    poolDataBefore,
    poolDataAfter
  );
  expectPoolData.sumHPTPerToken = sumHPTPerToken;
  expectPoolData.sumHLTCPerToken = sumHLTCPerToken;
  expectPoolData.VaultTotalRewardHLTC = poolDataBefore.VaultTotalRewardHLTC.plus(hLTCMintAmount);
  expectPoolData.VaultTotalRewardHPT = poolDataBefore.VaultTotalRewardHPT.plus(hHPTMintAmount);
  return expectPoolData;
};

export const expectMLTCUSDTPoolDataAfterAddNewPeriodReward = (
  hLTCMintAmount: BigNumber,
  hHPTMintAmount: BigNumber,
  endTime: BigNumber,
  poolDataBefore: PoolData,
  poolDataAfter: PoolData,
  txTimestamp: BigNumber,
  startMiningTime: BigNumber
) => {
  const expectPoolData = <PoolData>{};

  expectPoolData.totalSupply = poolDataBefore.totalSupply;
  expectPoolData.rewardLastUpdateTime = txTimestamp;

  expectPoolData.curPeriodStart = txTimestamp;
  expectPoolData.curPeriodEnd = endTime;

  if (poolDataBefore.curPeriodStart < txTimestamp && poolDataBefore.curPeriodEnd > txTimestamp) {
    const factor = 100000000;
    const ratio = poolDataBefore.curPeriodEnd
      .minus(txTimestamp)
      .multipliedBy(factor)
      .div(poolDataBefore.curPeriodEnd.minus(poolDataBefore.curPeriodStart));
    expectPoolData.curPeriodHLTC = poolDataBefore.curPeriodHLTC
      .multipliedBy(ratio)
      .div(factor)
      .plus(hLTCMintAmount);
    expectPoolData.curPeriodHPT = poolDataBefore.curPeriodHPT
      .multipliedBy(ratio)
      .div(factor)
      .plus(hHPTMintAmount);
  } else {
    expectPoolData.curPeriodHLTC = hLTCMintAmount;
    expectPoolData.curPeriodHPT = hHPTMintAmount;
  }

  const { sumHLTCPerToken, sumHPTPerToken } = calcLpSumPerTokenPoolData(
    txTimestamp,
    poolDataBefore,
    poolDataAfter
  );
  expectPoolData.sumHPTPerToken = sumHPTPerToken;
  expectPoolData.sumHLTCPerToken = sumHLTCPerToken;
  expectPoolData.VaultTotalRewardHLTC = poolDataBefore.VaultTotalRewardHLTC.plus(hLTCMintAmount);
  expectPoolData.VaultTotalRewardHPT = poolDataBefore.VaultTotalRewardHPT.plus(hHPTMintAmount);
  return expectPoolData;
};
