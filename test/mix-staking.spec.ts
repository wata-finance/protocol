import { makeSuite, TestEnv } from './utils/make-suite';
import { BigNumber } from 'bignumber.js';
import { convertToCurrencyDecimals, increaseTime, timeLatest } from '../helps/utils';
import { MAX_UINT_AMOUNT } from '../helps/constants';
import {
  addNewPeriodReward,
  mLTCClaimReward,
  mLTCExit,
  mLTCStake,
  mLTCWithdraw,
  mLTCUSDTClaimReward,
  mLTCUSDTExit,
  mLTCUSDTStake,
  mLTCUSDTWithdraw,
} from './utils/action';
const { expect } = require('chai');

makeSuite('mix staking', (testEnv: TestEnv) => {
  before('Initializing configuration', async () => {
    // 必须要配置，否则四舍五入或者最后一位对不上
    BigNumber.config({
      DECIMAL_PLACES: 0,
      ROUNDING_MODE: BigNumber.ROUND_DOWN,
    });
  });

  it('mint 10000 mLTC 10000 mLTCUSDTLp to user1 user and owner', async () => {
    const { users, Staking, MLTC, HLTC, HPT, Vault, owner, LpStaking, MLTCUSDTLp } = testEnv;
    const user1 = users[1];
    const user2 = users[2];
    // mint 9000 mLTC to owner, mint 500 to user, mint 500 to user2, order to staking
    const mLTCMintAmountToOwner = await convertToCurrencyDecimals(MLTC.address, '9000');
    const mLTCMintAmountToUser = await convertToCurrencyDecimals(MLTC.address, '500');
    const mLTCUSDTLpMintAmountToOwner = await convertToCurrencyDecimals(MLTCUSDTLp.address, '9000');
    const mLTCUSDTLpMintAmountToUser = await convertToCurrencyDecimals(MLTCUSDTLp.address, '500');
    await MLTC.mint(owner.address, mLTCMintAmountToOwner);
    await MLTC.mint(user1.address, mLTCMintAmountToUser);
    await MLTC.mint(user2.address, mLTCMintAmountToUser);
    await MLTCUSDTLp.connect(owner.signer).mint(mLTCUSDTLpMintAmountToOwner);
    await MLTCUSDTLp.connect(user1.signer).mint(mLTCUSDTLpMintAmountToUser);
    await MLTCUSDTLp.connect(user2.signer).mint(mLTCUSDTLpMintAmountToUser);
  });

  it('user1 stake 100 mLTCUSDTLp, addNewPeriodReward', async () => {
    const { users, Staking, MLTC, HLTC, HPT, Vault, owner, LpStaking, MLTCUSDTLp } = testEnv;
    // periodReward before stake
    await mLTCUSDTStake(
      testEnv,
      users[1],
      (await convertToCurrencyDecimals(MLTCUSDTLp.address, '100')).toString()
    );

    const startMiningTime = new BigNumber(await timeLatest()).plus(100);
    await Staking.connect(owner.signer).setStartMiningTime(startMiningTime.toString());
    await LpStaking.connect(owner.signer).setStartMiningTime(startMiningTime.toString());
    expect(await Staking.startMiningTime()).to.be.eq(startMiningTime.toString());
    expect(await LpStaking.startMiningTime()).to.be.eq(startMiningTime.toString());
    await increaseTime(1000);
    const endTime = new BigNumber(await timeLatest()).plus(3600 * 24);

    const hLTCMintAmount = await convertToCurrencyDecimals(HLTC.address, '100');
    await HLTC.mint(hLTCMintAmount);
    expect(await HLTC.balanceOf(owner.address)).to.be.eq(hLTCMintAmount);

    const hPTMintAmount = await convertToCurrencyDecimals(HPT.address, '10000');
    await HPT.mint(hPTMintAmount);
    expect(await HPT.balanceOf(owner.address)).to.be.eq(hPTMintAmount);

    await HLTC.approve(Vault.address, MAX_UINT_AMOUNT);
    await HPT.approve(Vault.address, MAX_UINT_AMOUNT);
    await addNewPeriodReward(testEnv, hLTCMintAmount.toString(), hPTMintAmount.toString(), endTime);
  });

  it('user1 stake 100 mLTC', async () => {
    await increaseTime(100);

    const { users, MLTC, MLTCUSDTLp } = testEnv;
    await mLTCStake(
      testEnv,
      users[1],
      (await convertToCurrencyDecimals(MLTC.address, '100')).toString()
    );
  });

  it('user2 stake 100 mLTC', async () => {
    const { users, MLTC, MLTCUSDTLp } = testEnv;
    await mLTCStake(
      testEnv,
      users[2],
      (await convertToCurrencyDecimals(MLTC.address, '100')).toString()
    );
  });

  it('user1 withdraw 50 mLTC', async () => {
    await increaseTime(100);

    const { users, MLTC } = testEnv;
    await mLTCWithdraw(
      testEnv,
      users[1],
      (await convertToCurrencyDecimals(MLTC.address, '50')).toString()
    );
  });

  it('user1 claimReward MLTCStaking', async () => {
    await increaseTime(100);

    const { users, MLTC, MLTCUSDTLp } = testEnv;
    await mLTCClaimReward(testEnv, users[1]);
  });

  it('user2 claimReward MLTCUSDTLpStaking', async () => {
    await increaseTime(100);

    const { users, MLTC, MLTCUSDTLp } = testEnv;
    await mLTCUSDTClaimReward(testEnv, users[2]);
  });

  it('user1 withdraw 50 mLTCUSDTLp, user2 claimReward MLTCStaking', async () => {
    await increaseTime(100);

    const { users, MLTC, MLTCUSDTLp } = testEnv;
    await mLTCUSDTWithdraw(
      testEnv,
      users[1],
      (await convertToCurrencyDecimals(MLTCUSDTLp.address, '50')).toString()
    );
    await mLTCClaimReward(testEnv, users[2]);
  });

  it('user1 user2 stake 100 mLTC, both withdraw', async () => {
    await increaseTime(100);

    const { users, MLTC, MLTCUSDTLp } = testEnv;
    await mLTCStake(
      testEnv,
      users[1],
      (await convertToCurrencyDecimals(MLTC.address, '100')).toString()
    );
    await mLTCStake(
      testEnv,
      users[2],
      (await convertToCurrencyDecimals(MLTC.address, '100')).toString()
    );
    await mLTCWithdraw(
      testEnv,
      users[1],
      (await convertToCurrencyDecimals(MLTC.address, '100')).toString()
    );
    await mLTCWithdraw(
      testEnv,
      users[2],
      (await convertToCurrencyDecimals(MLTC.address, '100')).toString()
    );
  });

  it('user1 stake 100 mLTC, user2 stake 100 mLTCUSDTLp, user1 withdraw all mLTCUSDTLp', async () => {
    await increaseTime(100);

    const { users, MLTC, MLTCUSDTLp, LpStaking } = testEnv;
    await mLTCStake(
      testEnv,
      users[1],
      (await convertToCurrencyDecimals(MLTC.address, '100')).toString()
    );
    await mLTCUSDTStake(
      testEnv,
      users[2],
      (await convertToCurrencyDecimals(MLTCUSDTLp.address, '100')).toString()
    );
    const AllMLTCUSDTLp = (await LpStaking.lpBalances(users[1].address)).toString();
    await mLTCUSDTWithdraw(testEnv, users[1], AllMLTCUSDTLp);
  });

  it('user2 exit mLTCStaking', async () => {
    const { users } = testEnv;
    await increaseTime(100);
    await mLTCExit(testEnv, users[2]);
  });

  it('addNewPeriodReward2', async () => {
    await increaseTime(10000);
    const { users, HPT, HLTC } = testEnv;
    const hPTMintAmount = await convertToCurrencyDecimals(HPT.address, '10000');
    await HPT.mint(hPTMintAmount);
    const hLTCMintAmount = await convertToCurrencyDecimals(HLTC.address, '100');
    await HLTC.mint(hLTCMintAmount);
    const endTime = new BigNumber(await timeLatest()).plus(3600 * 24);
    await addNewPeriodReward(testEnv, hLTCMintAmount.toString(), hPTMintAmount.toString(), endTime);
  });

  it('user1 user2 stake 100 mLTC, both withdraw', async () => {
    await increaseTime(100);

    const { users, MLTC, MLTCUSDTLp } = testEnv;
    await mLTCStake(
      testEnv,
      users[1],
      (await convertToCurrencyDecimals(MLTC.address, '100')).toString()
    );
    await mLTCStake(
      testEnv,
      users[2],
      (await convertToCurrencyDecimals(MLTC.address, '100')).toString()
    );
    await mLTCWithdraw(
      testEnv,
      users[1],
      (await convertToCurrencyDecimals(MLTC.address, '100')).toString()
    );
    await mLTCWithdraw(
      testEnv,
      users[2],
      (await convertToCurrencyDecimals(MLTC.address, '100')).toString()
    );
  });

  it('user2  exit mLTCUSDTLp', async () => {
    await increaseTime(100);

    const { users } = testEnv;
    await mLTCUSDTExit(testEnv, users[2]);
  });
});
