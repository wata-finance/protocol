import { ZERO_ADDRESS } from '../helps/constants';

const { expect } = require('chai');

import { makeSuite, TestEnv } from './utils/make-suite';

makeSuite('lpstaking', (testEnv: TestEnv) => {
  it('lpstaking param', async () => {
    const { owner, MLTC, Staking, LpStaking, Vault, MLTCUSDTLp } = testEnv;
    expect(await Staking.owner()).to.be.equal(owner.address);
    expect(await Staking.mLTC()).to.be.equal(MLTC.address);
    expect(await Staking.vault()).to.be.equal(Vault.address);
    expect(await Staking.mLTCUSDTLpStaking()).to.be.equal(LpStaking.address);
    expect(await Staking.REVISION()).to.be.equal(0x1);
  });

  it('transferOwnership', async () => {
    const { users, owner, Staking } = testEnv;
    await Staking.connect(owner.signer).transferOwnership(users[0].address);
    expect(await Staking.owner()).to.be.equal(users[0].address);
    await expect(
      Staking.connect(users[1].signer).transferOwnership(users[2].address)
    ).to.be.revertedWith('!owner');
    await expect(Staking.connect(users[1].signer).setEmergencyStop(false)).to.be.revertedWith(
      '!owner'
    );
    await expect(Staking.connect(users[1].signer).setStartMiningTime('0')).to.be.revertedWith(
      '!owner'
    );
    await Staking.connect(users[0].signer).transferOwnership(owner.address);
  });

  it('setEmergencyStop', async () => {
    const { owner, Staking } = testEnv;
    expect(await Staking.emergencyStop()).to.be.equal(false);
    await Staking.connect(owner.signer).setEmergencyStop(true);
    expect(await Staking.emergencyStop()).to.be.equal(true);
    await expect(Staking.claimReward()).to.be.revertedWith('emergency stop');
  });

  it('setStartMiningTime', async () => {
    const { owner, Staking } = testEnv;
    expect(await Staking.startMiningTime()).to.be.equal(0);
    const time = new Date().getTime() + 20 * 1000;
    const setStartMiningTime = Date.parse(new Date(time).toString()) / 1000;
    await Staking.connect(owner.signer).setStartMiningTime(setStartMiningTime);
    expect(await Staking.startMiningTime()).to.be.equal(setStartMiningTime);
  });
});
