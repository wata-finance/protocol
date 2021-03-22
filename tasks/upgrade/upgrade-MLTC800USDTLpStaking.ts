import { task } from 'hardhat/config';
import { ZERO_ADDRESS } from '../../helps/constants';
import { getAddressProvider, getLpStakingImpl, getMLTCImpl } from '../../helps/getter';
import { EthNetwork } from '../../helps/types';
import { getConfigByNetwork, loadConfig } from '../../helps/utils';
task('Upgrade:LpStaking', 'upgrade LpStaking!').setAction(async (_, _HRE) => {
  await _HRE.run('set-HRE');

  const addressProvider = await getAddressProvider();
  await _HRE.run('wata:LpStaking');

  const NewLpStakingImpl = await getLpStakingImpl();

  const { MLTC } = loadConfig();
  const network = <EthNetwork>_HRE.network.name;
  const MLTCConfig = getConfigByNetwork(network, MLTC);
  const VaultProxy = await addressProvider.getVAULTProxy();
  const MLTCProxy = (await getMLTCImpl()).address;
  const StakingProxy = await addressProvider.getStakingProxy();

  // 1. modify code version 2. modify ZERO_ADDRESS
  await addressProvider.setLpStakingImpl(
    false,
    MLTCConfig.owner,
    MLTCProxy,
    VaultProxy,
    StakingProxy,
    ZERO_ADDRESS,
    NewLpStakingImpl.address
  );
});
