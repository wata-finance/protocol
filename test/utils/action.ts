import { BigNumber } from 'bignumber.js';
import { Signer } from 'ethers';
import { Test } from 'mocha';
import { MAX_UINT_AMOUNT } from '../../helps/constants';
import { PoolData, UserData } from '../../helps/types';
const { expect } = require('chai');
import {
  convertToCurrencyDecimals,
  getContractData,
  getTxTimestamp,
  timeLatest,
  waitForTx,
} from '../../helps/utils';
import { expectMLTCPoolDataAfterAddNewPeriodReward } from './calc/addNewPeriodReward';
import {
  mLTCStakingExpectMLTCPoolDataAfterClaimed,
  mLTCStakingExpectMLTCUserDataAfterClaimed,
} from './calc/claimedReward';
import {
  mLTCStakingExpectMLTCPoolDataAfterExit,
  mLTCStakingExpectMLTCUSDTPoolDataAfterExit,
  mLTCStakingExpectMLTCUserDataAfterExit,
} from './calc/mLTCExit';
import {
  mLTCStakingExpectMLTCPoolDataAfterStake,
  mLTCStakingExpectMLTCUSDTPoolDataAfterStake,
  mLTCStakingExpectMLTCUserDataAfterStake,
} from './calc/mLTCStake';
import {
  mLTCStakingExpectMLTCPoolDataAfterWithdraw,
  mLTCStakingExpectMLTCUSDTPoolDataAfterWithdraw,
  mLTCStakingExpectMLTCUserDataAfterWithdraw,
} from './calc/mLTCWithdraw';
import { TestEnv } from './make-suite';
import { almostEqual } from './utils';
import {
  mLTCUSDLpStakingExpectLpStakingDataAfterStake,
  mLTCUSDTLpStakingExpectLpStakingUserDataAfterStake,
} from './calc/mLTCUSDTLpStake';
import {
  mLTCUSDLpStakingExpectLpStakingDataAfterWithdraw,
  mLTCUSDTLpStakingExpectLpStakingUserDataAfterWithdraw,
} from './calc/mLTCUSDTLpWithdraw';
import {
  mLTCUSDLpStakingExpectLpStakingDataAfterClaimReward,
  mLTCUSDLpStakingExpectLpStakingUserDataAfterClaimReward,
} from './calc/mLTCUSDTLpClaimedReward';
import {
  mLTCUSDLpStakingExpectLpStakingDataAfterExit,
  mLTCUSDLpStakingExpectLpStakingUserDataAfterExit,
} from './calc/mLTCUSDTLpExit';

export const addNewPeriodReward = async (
  testEnv: TestEnv,
  hLTCMintAmount: string,
  hPTMintAmount: string,
  endTime: BigNumber
) => {
  const { Vault, owner } = testEnv;
  const {
    mLTCPoolData: mLTCPoolDataBefore,
    mLTCUSDTPoolData: mLTCUSDTPoolDataBefore,
  } = await getContractData(testEnv, owner.address);

  let tx = await waitForTx(
    await Vault.connect(owner.signer).addNewPeriodReward(
      hLTCMintAmount,
      '0',
      hPTMintAmount,
      endTime.toString()
    )
  );
  const txTimestamp = new BigNumber(await getTxTimestamp(tx));
  const {
    mLTCPoolData: mLTCPoolDataAfter,
    mLTCUSDTPoolData: mLTCUSDTPoolDataAfter,
  } = await getContractData(testEnv, owner.address);

  const expectMLTCPoolData = await expectMLTCPoolDataAfterAddNewPeriodReward(
    new BigNumber(hLTCMintAmount),
    new BigNumber(hPTMintAmount),
    new BigNumber(endTime.toString()),
    mLTCPoolDataBefore,
    mLTCPoolDataAfter,
    txTimestamp
  );

  const expectMLTCUSDTPoolData = await expectMLTCPoolDataAfterAddNewPeriodReward(
    new BigNumber(hLTCMintAmount.toString()),
    new BigNumber(hPTMintAmount.toString()),
    new BigNumber(endTime.toString()),
    mLTCUSDTPoolDataBefore,
    mLTCUSDTPoolDataAfter,
    txTimestamp
  );
  almostEqual(mLTCPoolDataAfter, expectMLTCPoolData);
  // almostEqual(mLTCUSDTPoolDataAfter, expectMLTCUSDTPoolData);
};

export const mLTCStake = async (
  testEnv: TestEnv,
  user: {
    signer: Signer;
    address: string;
  },
  amountToStake: string
) => {
  const { Staking, MLTC } = testEnv;

  const {
    mLTCUserData: mLTCUserDataBefore,
    mLTCUSDTUserData: mLTCUSDTUserDataBefore,
    mLTCPoolData: mLTCPoolDataBefore,
    mLTCUSDTPoolData: mLTCUSDTPoolDataBefore,
  } = await getContractData(testEnv, user.address);

  await MLTC.connect(user.signer).approve(Staking.address, MAX_UINT_AMOUNT);
  const tx = await waitForTx(await Staking.connect(user.signer).stake(amountToStake));
  const txTimestamp = new BigNumber(await getTxTimestamp(tx));
  const timestamp = await timeLatest();
  const {
    mLTCUserData: mLTCUserDataAfter,
    mLTCUSDTUserData: mLTCUSDTUserDataAfter,
    mLTCPoolData: mLTCPoolDataAfter,
    mLTCUSDTPoolData: mLTCUSDTPoolDataAfter,
  } = await getContractData(testEnv, user.address);
  const expectedMLTCPoolData: PoolData = await mLTCStakingExpectMLTCPoolDataAfterStake(
    new BigNumber(amountToStake.toString()),
    mLTCPoolDataBefore,
    mLTCPoolDataAfter,
    txTimestamp,
    timestamp
  );
  almostEqual(mLTCPoolDataAfter, expectedMLTCPoolData);

  const expectedMLTCUSDTPoolData: PoolData = await mLTCStakingExpectMLTCUSDTPoolDataAfterStake(
    new BigNumber(amountToStake.toString()),
    mLTCUSDTPoolDataBefore,
    mLTCUSDTPoolDataAfter,
    txTimestamp,
    timestamp
  );
  almostEqual(mLTCUSDTPoolDataAfter, expectedMLTCUSDTPoolData);

  const expectedMLTCUserData: UserData = await mLTCStakingExpectMLTCUserDataAfterStake(
    new BigNumber(amountToStake.toString()),
    mLTCPoolDataBefore,
    mLTCPoolDataAfter,
    mLTCUserDataBefore,
    txTimestamp
  );
  almostEqual(mLTCUserDataAfter, expectedMLTCUserData);
  // stake user is not
  almostEqual(mLTCUSDTUserDataAfter, mLTCUSDTUserDataBefore);
};

export const mLTCWithdraw = async (
  testEnv: TestEnv,
  user: {
    signer: Signer;
    address: string;
  },
  amountToWithdraw: string
) => {
  const { users, Staking, MLTC } = testEnv;
  const {
    mLTCUserData: mLTCUserDataBefore,
    mLTCUSDTUserData: mLTCUSDTUserDataBefore,
    mLTCPoolData: mLTCPoolDataBefore,
    mLTCUSDTPoolData: mLTCUSDTPoolDataBefore,
  } = await getContractData(testEnv, user.address);

  const tx = await waitForTx(await Staking.connect(user.signer).withdraw(amountToWithdraw));
  const txTimestamp = new BigNumber(await getTxTimestamp(tx));
  const timestamp = await timeLatest();
  const {
    mLTCUserData: mLTCUserDataAfter,
    mLTCUSDTUserData: mLTCUSDTUserDataAfter,
    mLTCPoolData: mLTCPoolDataAfter,
    mLTCUSDTPoolData: mLTCUSDTPoolDataAfter,
  } = await getContractData(testEnv, user.address);
  const expectedMLTCPoolData: PoolData = await mLTCStakingExpectMLTCPoolDataAfterWithdraw(
    new BigNumber(amountToWithdraw.toString()),
    mLTCPoolDataBefore,
    mLTCPoolDataAfter,
    txTimestamp,
    timestamp
  );
  almostEqual(mLTCPoolDataAfter, expectedMLTCPoolData);

  const expectedMLTCUSDTPoolData: PoolData = await mLTCStakingExpectMLTCUSDTPoolDataAfterWithdraw(
    new BigNumber(amountToWithdraw.toString()),
    mLTCUSDTPoolDataBefore,
    mLTCUSDTPoolDataAfter,
    txTimestamp,
    timestamp
  );
  almostEqual(mLTCUSDTPoolDataAfter, expectedMLTCUSDTPoolData);

  const expectedMLTCUserData: UserData = await mLTCStakingExpectMLTCUserDataAfterWithdraw(
    new BigNumber(amountToWithdraw.toString()),
    mLTCPoolDataBefore,
    mLTCPoolDataAfter,
    mLTCUserDataBefore,
    txTimestamp
  );
  almostEqual(mLTCUserDataAfter, expectedMLTCUserData);
  // stake user is not
  almostEqual(mLTCUSDTUserDataAfter, mLTCUSDTUserDataBefore);
};

export const mLTCClaimReward = async (
  testEnv: TestEnv,
  user: {
    signer: Signer;
    address: string;
  }
) => {
  const { users, Staking, MLTC } = testEnv;
  const {
    mLTCUserData: mLTCUserDataBefore,
    mLTCUSDTUserData: mLTCUSDTUserDataBefore,
    mLTCPoolData: mLTCPoolDataBefore,
    mLTCUSDTPoolData: mLTCUSDTPoolDataBefore,
  } = await getContractData(testEnv, user.address);

  const tx = await waitForTx(await Staking.connect(user.signer).claimReward());

  const txTimestamp = new BigNumber(await getTxTimestamp(tx));
  const {
    mLTCUserData: mLTCUserDataAfter,
    mLTCUSDTUserData: mLTCUSDTUserDataAfter,
    mLTCPoolData: mLTCPoolDataAfter,
    mLTCUSDTPoolData: mLTCUSDTPoolDataAfter,
  } = await getContractData(testEnv, user.address);

  const expectedMLTCPoolData: PoolData = await mLTCStakingExpectMLTCPoolDataAfterClaimed(
    mLTCPoolDataBefore,
    mLTCPoolDataAfter,
    txTimestamp
  );
  almostEqual(expectedMLTCPoolData, mLTCPoolDataAfter);
  almostEqual(mLTCUSDTPoolDataAfter, mLTCUSDTPoolDataBefore);

  const expectedMLTCUserData: UserData = await mLTCStakingExpectMLTCUserDataAfterClaimed(
    mLTCUserDataBefore,
    mLTCPoolDataBefore,
    mLTCPoolDataBefore,
    txTimestamp
  );
  almostEqual(mLTCUserDataAfter, expectedMLTCUserData);
  almostEqual(mLTCUSDTUserDataAfter, mLTCUSDTUserDataBefore);
};

export const mLTCExit = async (
  testEnv: TestEnv,
  user: {
    signer: Signer;
    address: string;
  }
) => {
  const { Staking } = testEnv;
  const {
    mLTCUserData: mLTCUserDataBefore,
    mLTCUSDTUserData: mLTCUSDTUserDataBefore,
    mLTCPoolData: mLTCPoolDataBefore,
    mLTCUSDTPoolData: mLTCUSDTPoolDataBefore,
  } = await getContractData(testEnv, user.address);

  const tx = await waitForTx(await Staking.connect(user.signer).exit());
  const txTimestamp = new BigNumber(await getTxTimestamp(tx));
  const timestamp = await timeLatest();
  const {
    mLTCUserData: mLTCUserDataAfter,
    mLTCUSDTUserData: mLTCUSDTUserDataAfter,
    mLTCPoolData: mLTCPoolDataAfter,
    mLTCUSDTPoolData: mLTCUSDTPoolDataAfter,
  } = await getContractData(testEnv, user.address);
  const expectedMLTCPoolData: PoolData = await mLTCStakingExpectMLTCPoolDataAfterExit(
    mLTCPoolDataBefore,
    mLTCPoolDataAfter,
    mLTCUserDataBefore,
    txTimestamp,
    timestamp
  );
  almostEqual(mLTCPoolDataAfter, expectedMLTCPoolData);

  const expectedMLTCUSDTPoolData: PoolData = await mLTCStakingExpectMLTCUSDTPoolDataAfterExit(
    mLTCUSDTPoolDataBefore,
    mLTCUSDTPoolDataAfter,
    txTimestamp
  );
  almostEqual(mLTCUSDTPoolDataAfter, expectedMLTCUSDTPoolData);

  const expectedMLTCUserData: UserData = await mLTCStakingExpectMLTCUserDataAfterExit(
    mLTCPoolDataAfter
  );
  almostEqual(mLTCUserDataAfter, expectedMLTCUserData);
  // stake user is not
  almostEqual(mLTCUSDTUserDataAfter, mLTCUSDTUserDataBefore);
};

export const mLTCUSDTStake = async (
  testEnv: TestEnv,
  user: {
    signer: Signer;
    address: string;
  },
  amountToStake: string
) => {
  const { LpStaking, MLTCUSDTLp } = testEnv;

  const {
    mLTCUserData: mLTCUserDataBefore,
    mLTCUSDTUserData: mLTCUSDTUserDataBefore,
    mLTCPoolData: mLTCPoolDataBefore,
    mLTCUSDTPoolData: mLTCUSDTPoolDataBefore,
  } = await getContractData(testEnv, user.address);

  await MLTCUSDTLp.connect(user.signer).approve(LpStaking.address, MAX_UINT_AMOUNT);
  const tx = await waitForTx(await LpStaking.connect(user.signer).stake(amountToStake));
  const txTimestamp = new BigNumber(await getTxTimestamp(tx));
  const timestamp = await timeLatest();
  const {
    mLTCUserData: mLTCUserDataAfter,
    mLTCUSDTUserData: mLTCUSDTUserDataAfter,
    mLTCPoolData: mLTCPoolDataAfter,
    mLTCUSDTPoolData: mLTCUSDTPoolDataAfter,
  } = await getContractData(testEnv, user.address);

  const expectedMLTCUSDTPoolData: PoolData = await mLTCUSDLpStakingExpectLpStakingDataAfterStake(
    new BigNumber(amountToStake.toString()),
    mLTCUSDTPoolDataBefore,
    mLTCUSDTPoolDataAfter,
    txTimestamp,
    timestamp
  );
  almostEqual(mLTCUSDTPoolDataAfter, expectedMLTCUSDTPoolData);

  const expectedMLTCUSDTUserData: UserData = await mLTCUSDTLpStakingExpectLpStakingUserDataAfterStake(
    new BigNumber(amountToStake.toString()),
    mLTCUSDTPoolDataBefore,
    mLTCUSDTPoolDataAfter,
    mLTCUSDTUserDataBefore,
    txTimestamp
  );
  almostEqual(mLTCUSDTUserDataAfter, expectedMLTCUSDTUserData);
};

export const mLTCUSDTWithdraw = async (
  testEnv: TestEnv,
  user: {
    signer: Signer;
    address: string;
  },
  amountToWithdraw: string
) => {
  const { LpStaking } = testEnv;
  const {
    mLTCUserData: mLTCUserDataBefore,
    mLTCUSDTUserData: mLTCUSDTUserDataBefore,
    mLTCPoolData: mLTCPoolDataBefore,
    mLTCUSDTPoolData: mLTCUSDTPoolDataBefore,
  } = await getContractData(testEnv, user.address);

  const tx = await waitForTx(await LpStaking.connect(user.signer).withdraw(amountToWithdraw));
  const txTimestamp = new BigNumber(await getTxTimestamp(tx));
  const timestamp = await timeLatest();
  const {
    mLTCUserData: mLTCUserDataAfter,
    mLTCUSDTUserData: mLTCUSDTUserDataAfter,
    mLTCPoolData: mLTCPoolDataAfter,
    mLTCUSDTPoolData: mLTCUSDTPoolDataAfter,
  } = await getContractData(testEnv, user.address);

  const expectedMLTCUSDTPoolData: PoolData = await mLTCUSDLpStakingExpectLpStakingDataAfterWithdraw(
    new BigNumber(amountToWithdraw.toString()),
    mLTCUSDTPoolDataBefore,
    mLTCUSDTPoolDataAfter,
    txTimestamp,
    timestamp
  );
  almostEqual(mLTCUSDTPoolDataAfter, expectedMLTCUSDTPoolData);

  const expectedMLTCUSDTUserData: UserData = await mLTCUSDTLpStakingExpectLpStakingUserDataAfterWithdraw(
    new BigNumber(amountToWithdraw.toString()),
    mLTCUSDTPoolDataBefore,
    mLTCUSDTPoolDataAfter,
    mLTCUSDTUserDataBefore,
    txTimestamp
  );
  almostEqual(mLTCUSDTUserDataAfter, expectedMLTCUSDTUserData);
};

export const mLTCUSDTClaimReward = async (
  testEnv: TestEnv,
  user: {
    signer: Signer;
    address: string;
  }
) => {
  const { LpStaking } = testEnv;
  const {
    mLTCUserData: mLTCUserDataBefore,
    mLTCUSDTUserData: mLTCUSDTUserDataBefore,
    mLTCPoolData: mLTCPoolDataBefore,
    mLTCUSDTPoolData: mLTCUSDTPoolDataBefore,
  } = await getContractData(testEnv, user.address);

  const tx = await waitForTx(await LpStaking.connect(user.signer).claimReward());

  const txTimestamp = new BigNumber(await getTxTimestamp(tx));
  const {
    mLTCUserData: mLTCUserDataAfter,
    mLTCUSDTUserData: mLTCUSDTUserDataAfter,
    mLTCPoolData: mLTCPoolDataAfter,
    mLTCUSDTPoolData: mLTCUSDTPoolDataAfter,
  } = await getContractData(testEnv, user.address);

  const expectedMLTCUSDTPoolData: PoolData = await mLTCUSDLpStakingExpectLpStakingDataAfterClaimReward(
    mLTCUSDTPoolDataBefore,
    mLTCUSDTPoolDataAfter,
    txTimestamp
  );
  almostEqual(mLTCUSDTPoolDataAfter, expectedMLTCUSDTPoolData);

  const expectedMLTCUSDTUserData: UserData = await mLTCUSDLpStakingExpectLpStakingUserDataAfterClaimReward(
    mLTCUSDTPoolDataBefore,
    mLTCUSDTPoolDataAfter,
    mLTCUSDTUserDataBefore,
    txTimestamp
  );
  almostEqual(mLTCUSDTUserDataAfter, expectedMLTCUSDTUserData);
};

export const mLTCUSDTExit = async (
  testEnv: TestEnv,
  user: {
    signer: Signer;
    address: string;
  }
) => {
  const { LpStaking } = testEnv;
  const {
    mLTCUserData: mLTCUserDataBefore,
    mLTCUSDTUserData: mLTCUSDTUserDataBefore,
    mLTCPoolData: mLTCPoolDataBefore,
    mLTCUSDTPoolData: mLTCUSDTPoolDataBefore,
  } = await getContractData(testEnv, user.address);

  const tx = await waitForTx(await LpStaking.connect(user.signer).exit());
  const txTimestamp = new BigNumber(await getTxTimestamp(tx));
  const timestamp = await timeLatest();
  const {
    mLTCUserData: mLTCUserDataAfter,
    mLTCUSDTUserData: mLTCUSDTUserDataAfter,
    mLTCPoolData: mLTCPoolDataAfter,
    mLTCUSDTPoolData: mLTCUSDTPoolDataAfter,
  } = await getContractData(testEnv, user.address);

  const expectedMLTCUSDTPoolData: PoolData = await mLTCUSDLpStakingExpectLpStakingDataAfterExit(
    mLTCUSDTPoolDataBefore,
    mLTCUSDTPoolDataAfter,
    mLTCUSDTUserDataBefore,
    txTimestamp,
    timestamp
  );
  almostEqual(mLTCUSDTPoolDataAfter, expectedMLTCUSDTPoolData);

  const expectedMLTCUSDTUserData: UserData = await mLTCUSDLpStakingExpectLpStakingUserDataAfterExit(
    mLTCUSDTPoolDataBefore,
    mLTCUSDTPoolDataAfter,
    mLTCUSDTUserDataBefore,
    txTimestamp,
    timestamp
  );
  almostEqual(mLTCUSDTUserDataAfter, expectedMLTCUSDTUserData);
};
