const { expect } = require('chai');
import { makeSuite, TestEnv } from './utils/make-suite';

makeSuite('Staking: revert', (testEnv: TestEnv) => {
  before('emergencystop == true', async () => {
    const { deployer, users, Staking } = testEnv;
    await Staking.connect(deployer.signer).setEmergencyStop(true);
  });

  it('addNewPeriodReward: not vault', async () => {
    const { users, Staking } = testEnv;
    await expect(
      Staking.connect(users[3].signer).addNewPeriodReward(1, 1, 1, 1)
    ).to.be.revertedWith('!vault');
  });

  it('setEmergencyStop: not owner', async () => {
    const { users, Staking } = testEnv;
    await expect(Staking.connect(users[3].signer).setEmergencyStop(false)).to.be.revertedWith(
      '!owner'
    );
  });

  it('transferOwnership: not owner', async () => {
    const { deployer, users, Staking } = testEnv;
    await expect(
      Staking.connect(users[3].signer).transferOwnership(users[3].address)
    ).to.be.revertedWith('!owner');
  });

  it('setStartMiningTime: not owner', async () => {
    const { users, Staking } = testEnv;
    await expect(Staking.connect(users[3].signer).setStartMiningTime(1)).to.be.revertedWith(
      '!owner'
    );
  });

  it('claimReward', async () => {
    const { users, Staking } = testEnv;
    await expect(Staking.connect(users[3].signer).claimReward()).to.be.revertedWith(
      'emergency stop'
    );
  });

  it('update new owner', async () => {
    const { users, Staking, owner } = testEnv;
    await Staking.connect(owner.signer).transferOwnership(users[3].address);

    await expect(Staking.connect(owner.signer).setEmergencyStop(false)).to.be.revertedWith(
      '!owner'
    );
    await expect(Staking.connect(owner.signer).setStartMiningTime(1)).to.be.revertedWith('!owner');
  });
});
