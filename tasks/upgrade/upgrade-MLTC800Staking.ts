import { task } from 'hardhat/config';
import { getAddressProvider, getStaking } from '../../helps/getter';
import { EthNetwork } from '../../helps/types';
import { getConfigByNetwork, loadConfig } from '../../helps/utils';
task('Upgrade:Staking', 'upgrade Staking!').setAction(async (_, _HRE) => {
  await _HRE.run('set-HRE');

  const addressProvider = await getAddressProvider();
  await _HRE.run('wata:Staking');

  const NewStakingNImpl = await getStaking();

  const { MLTC } = loadConfig();
  const network = <EthNetwork>_HRE.network.name;
  const MLTCConfig = getConfigByNetwork(network, MLTC);
  const VaultProxy = await addressProvider.getVAULTProxy();
  const MLTCProxy = await addressProvider.getMLTCProxy();
  const LpStakingProxy = await addressProvider.getLpStakingProxy();

  await addressProvider.setStakingImpl(
    false,
    MLTCConfig.owner,
    MLTCProxy,
    LpStakingProxy,
    VaultProxy,
    NewStakingNImpl.address
  );
});
