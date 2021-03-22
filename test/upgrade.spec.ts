import getOwnPropertyDescriptor = Reflect.getOwnPropertyDescriptor;

const { expect } = require('chai');
import { makeSuite, TestEnv } from './utils/make-suite';
import { deployMockVault, deployMockStaking, deployMockLpStaking } from '../helps/deploy';
import { EthNetwork } from '../helps/types';
import { getConfigByNetwork, HRE, loadConfig } from '../helps/utils';
import { getAddressProvider, getMLTCImpl } from '../helps/getter';
import { ZERO_ADDRESS } from '../helps/constants';

makeSuite('Upgrade', (testEnv: TestEnv) => {
  let newVaultAddress: string;
  let newStakingAddress: string;
  let newMockLpStaking: string;

  let MLTCConfig;
  let MLTCProxy;
  let VaultProxy;
  let StakingProxy;
  let LpStakingProxy;

  before('deploy instances', async () => {
    const vaultInstance = await deployMockVault();
    newVaultAddress = vaultInstance.address;

    const StakingInstance = await deployMockStaking();
    newStakingAddress = StakingInstance.address;

    const LpStakingInstance = await deployMockLpStaking();
    newMockLpStaking = LpStakingInstance.address;

    const { MLTC } = loadConfig();
    const network = <EthNetwork>HRE.network.name;
    const addressProvider = await getAddressProvider();
    MLTCConfig = getConfigByNetwork(network, MLTC);
    MLTCProxy = (await getMLTCImpl()).address;
    VaultProxy = await addressProvider.getVAULTProxy();
    StakingProxy = await addressProvider.getStakingProxy();
    LpStakingProxy = await addressProvider.getLpStakingProxy();
  });

  it('Upgrade the Vault  implementation', async () => {
    const { addressProvider, deployer, Vault, users } = testEnv;
    const owner = users[2];
    await addressProvider.setVAULTImpl(
      false,
      owner.address,
      MLTCConfig.HLTC,
      ZERO_ADDRESS,
      MLTCConfig.HPT,
      StakingProxy,
      LpStakingProxy,
      newVaultAddress
    );
    expect(await Vault.owner()).to.be.eq(owner.address);
  });

  it('Upgrade the Staking implementation', async () => {
    const { addressProvider, deployer, Staking, users } = testEnv;
    const owner = users[2];
    await addressProvider.setStakingImpl(
      false,
      owner.address,
      MLTCProxy,
      LpStakingProxy,
      VaultProxy,
      newStakingAddress
    );
    expect(await Staking.owner()).to.be.eq(owner.address);
  });

  it('Upgrade the StakingInstance implementation', async () => {
    const { addressProvider, LpStaking, users } = testEnv;
    const owner = users[2];
    await addressProvider.setLpStakingImpl(
      false,
      owner.address,
      MLTCProxy,
      VaultProxy,
      StakingProxy,
      ZERO_ADDRESS,
      newMockLpStaking
    );
    expect(await LpStaking.owner()).to.be.eq(owner.address);
  });

  it('Updated Vault with not owner - revert', async () => {
    const { addressProvider, users } = testEnv;
    await expect(
      addressProvider
        .connect(users[2].signer)
        .setVAULTImpl(
          false,
          users[2].address,
          MLTCConfig.HLTC,
          ZERO_ADDRESS,
          MLTCConfig.HPT,
          StakingProxy,
          LpStakingProxy,
          newVaultAddress
        )
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('updated Staking with not owner - revert', async () => {
    const { addressProvider, users } = testEnv;
    await expect(
      addressProvider
        .connect(users[2].signer)
        .setStakingImpl(
          false,
          users[2].address,
          MLTCProxy,
          LpStakingProxy,
          VaultProxy,
          newStakingAddress
        )
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('Updated LpStaking with not owner - revert', async () => {
    const { addressProvider, users } = testEnv;
    await expect(
      addressProvider
        .connect(users[2].signer)
        .setLpStakingImpl(
          false,
          users[2].address,
          MLTCProxy,
          VaultProxy,
          StakingProxy,
          ZERO_ADDRESS,
          newMockLpStaking
        )
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });
});
