const { expect } = require('chai');
import { makeSuite, TestEnv } from './utils/make-suite';
import { convertToCurrencyDecimals } from '../helps/utils';
import { Vault } from '../types/Vault';
import { ethers, EventFilter, Signer, BigNumber, BigNumberish, PopulatedTransaction } from 'ethers';

makeSuite('Valut: revert', (testEnv: TestEnv) => {
  it('addNewPeriodReward : not owner', async () => {
    const { deployer, users, owner, Staking, Vault } = testEnv;
    await expect(Vault.connect(users[3].signer).addNewPeriodReward(1, 1, 1, 1)).to.be.revertedWith(
      '!owner'
    );
  });

  it('transferOwnership: not owner', async () => {
    const { deployer, users, Staking, Vault } = testEnv;
    await expect(
      Vault.connect(users[3].signer).transferOwnership(users[3].address)
    ).to.be.revertedWith('!owner');
  });
});
