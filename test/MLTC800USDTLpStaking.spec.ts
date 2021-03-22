const { expect } = require('chai');
import { MAX_UINT_AMOUNT } from '../helps/constants';
import {
  convertToCurrencyDecimals,
  timeLatest,
  increaseTime,
  getContractData,
} from '../helps/utils';
import { makeSuite, TestEnv } from './utils/make-suite';
import { BigNumber } from 'bignumber.js';
import {
  addNewPeriodReward,
  mLTCUSDTClaimReward,
  mLTCUSDTExit,
  mLTCUSDTStake,
  mLTCUSDTWithdraw,
} from './utils/action';

makeSuite('LpStaking test', (testEnv: TestEnv) => {
  it('Transfer 100 HLTC, then mint 10000 mLTC to user1 user2 and owner', async () => {
    const { users, Staking, LpStaking, MLTC, HLTC, HPT, Vault, owner, MLTCUSDTLp } = testEnv;
    const user1 = users[1];
    const user2 = users[2];
    // 1. transfer 100 HLTC to owner, insert to Vault
    const hLTCMintAmount = await convertToCurrencyDecimals(HLTC.address, '100');
    await HLTC.mint(hLTCMintAmount);
    expect(await HLTC.balanceOf(owner.address)).to.be.eq(hLTCMintAmount);

    const hPTMintAmount = await convertToCurrencyDecimals(HPT.address, '10000');
    await HPT.mint(hPTMintAmount);
    expect(await HPT.balanceOf(owner.address)).to.be.eq(hPTMintAmount);

    // 2. mint 9000 mLTC to owner, mint 500 to user1, mint 500 to user2, order to staking
    const mLTCMintAmountToOwner = await convertToCurrencyDecimals(MLTC.address, '9000');
    const mLTCMintAmountToUser = await convertToCurrencyDecimals(MLTC.address, '500');
    const mLTCUSDTLpMintAmountToUser = await convertToCurrencyDecimals(MLTCUSDTLp.address, '500');
    await MLTC.mint(owner.address, mLTCMintAmountToOwner);
    await MLTC.mint(user1.address, mLTCMintAmountToUser);
    await MLTC.mint(user2.address, mLTCMintAmountToUser);
    await MLTCUSDTLp.connect(owner.signer).mint(mLTCMintAmountToOwner);
    await MLTCUSDTLp.connect(user1.signer).mint(mLTCUSDTLpMintAmountToUser);
    await MLTCUSDTLp.connect(user2.signer).mint(mLTCUSDTLpMintAmountToUser);

    // 3. addNewPeriod to staking
    await HLTC.approve(Vault.address, MAX_UINT_AMOUNT);
    await HPT.approve(Vault.address, MAX_UINT_AMOUNT);

    const { mLTCUSDTPoolData: mLTCUSDTPoolDataBefore } = await getContractData(
      testEnv,
      owner.address
    );
    const startMiningTime = new BigNumber(await timeLatest()).plus(100);
    await Staking.connect(owner.signer).setStartMiningTime(startMiningTime.toString());
    await LpStaking.connect(owner.signer).setStartMiningTime(startMiningTime.toString());
    expect(await Staking.startMiningTime()).to.be.eq(startMiningTime.toString());
    expect(await LpStaking.startMiningTime()).to.be.eq(startMiningTime.toString());
    await increaseTime(1000);
    const endTime = new BigNumber(await timeLatest()).plus(3600 * 24);
    await addNewPeriodReward(testEnv, hLTCMintAmount.toString(), hPTMintAmount.toString(), endTime);
  });

  it('after 10000 seconds user1 staking 10 mLTCUSDTLp', async () => {
    const { users, MLTCUSDTLp } = testEnv;
    await increaseTime(10000);
    await mLTCUSDTStake(
      testEnv,
      users[1],
      (await convertToCurrencyDecimals(MLTCUSDTLp.address, '10')).toString()
    );
  });

  it('after 10000 seconds user2 staking 20 mLTCUSDTLp. ', async () => {
    const { users, MLTCUSDTLp } = testEnv;
    await increaseTime(10000);
    await mLTCUSDTStake(
      testEnv,
      users[2],
      (await convertToCurrencyDecimals(MLTCUSDTLp.address, '20')).toString()
    );
  });

  it('after 10000 seconds1 user withdraw 5 mLTCUSDTLp', async () => {
    const { users, MLTCUSDTLp } = testEnv;
    await increaseTime(10000);
    await mLTCUSDTWithdraw(
      testEnv,
      users[1],
      (await convertToCurrencyDecimals(MLTCUSDTLp.address, '5')).toString()
    );
  });

  it('after 100000 seconds user2 withdraw 15 mLTCUSDTLp.', async () => {
    const { users, MLTCUSDTLp } = testEnv;
    await increaseTime(10000);
    await mLTCUSDTWithdraw(
      testEnv,
      users[2],
      (await convertToCurrencyDecimals(MLTCUSDTLp.address, '5')).toString()
    );
  });

  it('User1 withdraw 10 mLTCUSDTLp (gt balance revert)', async () => {
    const { users, LpStaking, MLTCUSDTLp } = testEnv;
    const user = users[1];
    const amountToWithdraw = await convertToCurrencyDecimals(MLTCUSDTLp.address, '10');
    await expect(LpStaking.connect(user.signer).withdraw(amountToWithdraw)).to.be.reverted;
  });

  it('User2 withdraw 20 mLTCUSDTLp (gt balance revert)', async () => {
    const { users, LpStaking, MLTCUSDTLp } = testEnv;
    const user = users[2];
    const amountToWithdraw = await convertToCurrencyDecimals(MLTCUSDTLp.address, '20');
    await expect(LpStaking.connect(user.signer).withdraw(amountToWithdraw)).to.be.reverted;
  });

  it('user1 claimReward', async () => {
    const { users } = testEnv;
    await increaseTime(10000);
    await mLTCUSDTClaimReward(testEnv, users[1]);
  });

  it('user2 claimReward', async () => {
    const { users } = testEnv;
    const user = users[2];
    await increaseTime(10000);
    await mLTCUSDTClaimReward(testEnv, users[2]);
  });

  it('after 100000 seconds User1 exit', async () => {
    const { users } = testEnv;
    await increaseTime(10000);
    await mLTCUSDTExit(testEnv, users[1]);
  });

  it('after 100000 seconds User2 exit', async () => {
    const { users } = testEnv;
    await increaseTime(10000);
    await mLTCUSDTExit(testEnv, users[2]);
  });
});
