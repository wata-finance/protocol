import { ZERO_ADDRESS } from '../helps/constants';

const { expect } = require('chai');

import { makeSuite, TestEnv } from './utils/make-suite';

makeSuite('lpstaking', (testEnv: TestEnv) => {
  it('lpstaking param', async () => {
    const { owner, MLTC, Staking, LpStaking, Vault, MLTCUSDTLp } = testEnv;
    expect(await LpStaking.owner()).to.be.equal(owner.address);
    expect(await LpStaking.mLTC()).to.be.equal(MLTC.address);
    expect(await LpStaking.vault()).to.be.equal(Vault.address);
    expect(await LpStaking.mLTCUSDTLpToken()).to.be.equal(MLTCUSDTLp.address);
    expect(await LpStaking.mLTCStaking()).to.be.equal(Staking.address);
    expect(await LpStaking.REVISION()).to.be.equal(0x1);
  });

  it('transferOwnership', async () => {
    const { users, owner, LpStaking } = testEnv;
    await LpStaking.connect(owner.signer).transferOwnership(users[0].address);
    expect(await LpStaking.owner()).to.be.equal(users[0].address);
    await expect(
      LpStaking.connect(users[1].signer).transferOwnership(users[2].address)
    ).to.be.revertedWith('!owner');
    await expect(LpStaking.connect(users[1].signer).setEmergencyStop(false)).to.be.revertedWith(
      '!owner'
    );
    await expect(LpStaking.connect(users[1].signer).setStartMiningTime('0')).to.be.revertedWith(
      '!owner'
    );
    await LpStaking.connect(users[0].signer).transferOwnership(owner.address);
  });

  it('setEmergencyStop', async () => {
    const { owner, LpStaking } = testEnv;
    expect(await LpStaking.emergencyStop()).to.be.equal(false);
    await LpStaking.connect(owner.signer).setEmergencyStop(true);
    expect(await LpStaking.emergencyStop()).to.be.equal(true);
    await expect(LpStaking.claimReward()).to.be.revertedWith('emergency stop');
  });

  it('setStartMiningTime', async () => {
    const { owner, LpStaking } = testEnv;
    expect(await LpStaking.startMiningTime()).to.be.equal(0);
    const time = new Date().getTime() + 20 * 1000;
    const setStartMiningTime = Date.parse(new Date(time).toString()) / 1000;
    await LpStaking.connect(owner.signer).setStartMiningTime(setStartMiningTime);
    expect(await LpStaking.startMiningTime()).to.be.equal(setStartMiningTime);
  });
});
