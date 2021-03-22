import { task } from 'hardhat/config';
import { getAddressProvider, getMLTCImpl, getStaking, getVaultImpl } from '../../helps/getter';
import { EthNetwork } from '../../helps/types';
import { getConfigByNetwork, loadConfig, waitForTx } from '../../helps/utils';

task('wata:init', 'Init Contract').setAction(async (_, _HRE) => {
  await _HRE.run('set-HRE');
  const addressProvider = await getAddressProvider();
  const MLTCAddress = (await getMLTCImpl()).address;
  const VaultAddress = (await getVaultImpl()).address;
  const StakingAddress = (await getStaking()).address;

  const { MLTC } = loadConfig();
  const network = <EthNetwork>_HRE.network.name;
  const MLTCConfig = getConfigByNetwork(network, MLTC);

  const VaultProxy = await addressProvider.getVAULTProxy();
  const StakingProxy = await addressProvider.getStakingProxy();
  const LpStakingProxy = await addressProvider.getLpStakingProxy();

  console.log('	-- Init Vault...', VaultAddress);
  await waitForTx(
    await addressProvider.setVAULTImpl(
      true,
      MLTCConfig.owner,
      MLTCConfig.HLTC,
      MLTCConfig.HDOGE,
      MLTCConfig.HPT,
      StakingProxy,
      LpStakingProxy,
      VaultAddress
    )
  );

  const currentTime = Date.parse(new Date().toString()) / 1000;
  console.log('	-- Init Staking...', currentTime);
  await waitForTx(
    await addressProvider.setStakingImpl(
      true,
      MLTCConfig.owner,
      MLTCAddress,
      LpStakingProxy,
      VaultProxy,
      StakingAddress
    )
  );
});
