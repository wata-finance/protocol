const { expect } = require('chai');
import { makeSuite, TestEnv } from './utils/make-suite';

makeSuite('LpStaking: revert', (testEnv: TestEnv) => {
  before('emergencystop == true', async () => {
    const { deployer, users, LpStaking } = testEnv;
    await LpStaking.connect(deployer.signer).setEmergencyStop(true);
  });

  it('setEmergencyStop: not owner', async () => {
    const { users, LpStaking } = testEnv;
    await expect(LpStaking.connect(users[3].signer).setEmergencyStop(false)).to.be.revertedWith(
      '!owner'
    );
  });

  it('transferOwnership: not owner', async () => {
    const { users, LpStaking } = testEnv;
    await expect(
      LpStaking.connect(users[3].signer).transferOwnership(users[3].address)
    ).to.be.revertedWith('!owner');
  });

  it('setStartMiningTime: not owner', async () => {
    const { users, LpStaking } = testEnv;
    await expect(LpStaking.connect(users[3].signer).setStartMiningTime(1)).to.be.revertedWith(
      '!owner'
    );
  });

  it('addNewPeriodReward: not vault', async () => {
    const { users, LpStaking } = testEnv;
    await expect(
      LpStaking.connect(users[3].signer).addNewPeriodReward(1, 1, 1, 1)
    ).to.be.revertedWith('!vault');
  });

  it('claimHLTC', async () => {
    const { users, LpStaking } = testEnv;
    await expect(LpStaking.connect(users[3].signer).claimReward()).to.be.revertedWith(
      'emergency stop'
    );
  });

  it('update new owner', async () => {
    const { users, LpStaking, owner } = testEnv;
    await LpStaking.connect(owner.signer).transferOwnership(users[3].address);

    await expect(LpStaking.connect(owner.signer).setEmergencyStop(false)).to.be.revertedWith(
      '!owner'
    );

    await expect(LpStaking.connect(owner.signer).setStartMiningTime(1)).to.be.revertedWith(
      '!owner'
    );
  });
});
