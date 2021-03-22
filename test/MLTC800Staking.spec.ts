const { expect } = require('chai');
import { MAX_UINT_AMOUNT } from '../helps/constants';
import { convertToCurrencyDecimals, timeLatest, increaseTime } from '../helps/utils';
import { makeSuite, TestEnv } from './utils/make-suite';
import { BigNumber } from 'bignumber.js';

import {
  addNewPeriodReward,
  mLTCClaimReward,
  mLTCExit,
  mLTCStake,
  mLTCWithdraw,
} from './utils/action';
makeSuite('Staking: test stake, withdraw', (testEnv: TestEnv) => {
  before('Initializing configuration', async () => {
    // 必须要配置，否则四舍五入或者最后一位对不上
    BigNumber.config({
      DECIMAL_PLACES: 0,
      ROUNDING_MODE: BigNumber.ROUND_DOWN,
    });
  });

  it('addNewPeriodReward  Transfer 100 HLTC, then mint 10000 mLTC to user1 user and owner', async () => {
    const { users, Staking, MLTC, HLTC, HPT, Vault, owner } = testEnv;
    const user = users[1];
    const user2 = users[2];
    // 1. transfer 100 HLTC to owner, insert to Vault
    const hLTCMintAmount = await convertToCurrencyDecimals(HLTC.address, '100');
    await HLTC.mint(hLTCMintAmount);
    expect(await HLTC.balanceOf(owner.address)).to.be.eq(hLTCMintAmount);

    const hPTMintAmount = await convertToCurrencyDecimals(HPT.address, '10000');
    await HPT.mint(hPTMintAmount);
    expect(await HPT.balanceOf(owner.address)).to.be.eq(hPTMintAmount);

    // 2. mint 9000 mLTC to owner, mint 500 to user, mint 500 to user2, order to staking
    const mLTCMintAmountToOwner = await convertToCurrencyDecimals(MLTC.address, '9000');
    const mLTCMintAmountToUser = await convertToCurrencyDecimals(MLTC.address, '500');
    await MLTC.mint(owner.address, mLTCMintAmountToOwner);
    await MLTC.mint(user.address, mLTCMintAmountToUser);
    await MLTC.mint(user2.address, mLTCMintAmountToUser);

    // 3. addNewPeriod to staking
    await HLTC.approve(Vault.address, MAX_UINT_AMOUNT);
    await HPT.approve(Vault.address, MAX_UINT_AMOUNT);
    // periodReward before stake
    await increaseTime(10000);
    await mLTCStake(
      testEnv,
      users[2],
      (await convertToCurrencyDecimals(MLTC.address, '20')).toString()
    );
    await increaseTime(10000);

    const startMiningTime = new BigNumber(await timeLatest()).plus(100);
    await Staking.connect(owner.signer).setStartMiningTime(startMiningTime.toString());
    expect(await Staking.startMiningTime()).to.be.eq(startMiningTime.toString());
    await increaseTime(1000);
    const endTime = new BigNumber(await timeLatest()).plus(3600 * 24);

    // periodReward before stake
    await mLTCStake(
      testEnv,
      users[1],
      (await convertToCurrencyDecimals(MLTC.address, '10')).toString()
    );
    await increaseTime(1000);
    await addNewPeriodReward(testEnv, hLTCMintAmount.toString(), hPTMintAmount.toString(), endTime);
  });

  it('after 10000 seconds user1 staking 10 mLTC', async () => {
    const { users, MLTC } = testEnv;
    await increaseTime(10000);
    await mLTCStake(
      testEnv,
      users[1],
      (await convertToCurrencyDecimals(MLTC.address, '10')).toString()
    );
  });

  it('after 10000 seconds user2 staking 20 mLTC. ', async () => {
    const { users, MLTC } = testEnv;
    await increaseTime(10000);
    await mLTCStake(
      testEnv,
      users[2],
      (await convertToCurrencyDecimals(MLTC.address, '20')).toString()
    );
  });

  it('after 10000 seconds user1 withdraw 5 mLTC', async () => {
    const { users, MLTC } = testEnv;
    await increaseTime(10000);
    await mLTCWithdraw(
      testEnv,
      users[1],
      (await convertToCurrencyDecimals(MLTC.address, '5')).toString()
    );
  });

  it('after 100000 seconds user2 withdraw 15 mLTC.', async () => {
    const { users, Staking, MLTC } = testEnv;
    await increaseTime(10000);
    await mLTCWithdraw(
      testEnv,
      users[2],
      (await convertToCurrencyDecimals(MLTC.address, '5')).toString()
    );
  });

  it('User1 withdraw 1000 mLTC (gt balance revert)', async () => {
    const { users, Staking, MLTC } = testEnv;
    const user = users[1];
    const amountToWithdraw = await convertToCurrencyDecimals(MLTC.address, '1000');
    await expect(Staking.connect(user.signer).withdraw(amountToWithdraw)).to.be.reverted;
  });
  it('User2 withdraw 200 mLTC (gt balance revert)', async () => {
    const { users, Staking, MLTC } = testEnv;
    const user = users[2];
    const amountToWithdraw = await convertToCurrencyDecimals(MLTC.address, '200');
    await expect(Staking.connect(user.signer).withdraw(amountToWithdraw)).to.be.reverted;
  });

  it('user1 claimReward', async () => {
    const { users } = testEnv;
    await increaseTime(10000);
    await mLTCClaimReward(testEnv, users[1]);
  });

  it('user2 claimReward', async () => {
    const { users, Staking, MLTC } = testEnv;
    const user = users[2];
    await increaseTime(10000);
    await mLTCClaimReward(testEnv, users[2]);
  });

  it('AddNewPeriodReward Transfer 55 HLTC, then mint 100 HPT to user user and owner', async () => {
    const { users, Staking, MLTC, HLTC, HPT, Vault, owner } = testEnv;
    const user = users[1];
    const user2 = users[2];
    // 1. transfer 100 HLTC to owner, insert to Vault
    const hLTCMintAmount = await convertToCurrencyDecimals(HLTC.address, '55');
    await HLTC.mint(hLTCMintAmount);
    expect(await HLTC.balanceOf(owner.address)).to.be.eq(hLTCMintAmount);

    const hPTMintAmount = await convertToCurrencyDecimals(HPT.address, '100');
    await HPT.mint(hPTMintAmount);
    expect(await HPT.balanceOf(owner.address)).to.be.eq(hPTMintAmount);

    await increaseTime(1000);

    const endTime = new BigNumber(await timeLatest()).plus(3600 * 24);
    await addNewPeriodReward(testEnv, hLTCMintAmount.toString(), hPTMintAmount.toString(), endTime);
  });

  it('after 10000 seconds user1 staking 100 mLTC', async () => {
    const { users, MLTC } = testEnv;
    await increaseTime(10000);
    await mLTCStake(
      testEnv,
      users[1],
      (await convertToCurrencyDecimals(MLTC.address, '100')).toString()
    );
  });

  it('after 10000 seconds user2 staking 50 mLTC. ', async () => {
    const { users, MLTC } = testEnv;
    await increaseTime(10000);
    await mLTCStake(
      testEnv,
      users[2],
      (await convertToCurrencyDecimals(MLTC.address, '50')).toString()
    );
  });

  it('after 100000 seconds User1 exit', async () => {
    const { users, Staking, MLTC } = testEnv;
    await increaseTime(10000);
    await mLTCExit(testEnv, users[1]);
  });

  it('after 100000 seconds User2 exit', async () => {
    const { users, Staking, MLTC } = testEnv;
    await increaseTime(10000);
    await mLTCExit(testEnv, users[2]);
  });
});
