import { task } from 'hardhat/config';
import { getAddressProvider, getVaultImpl } from '../../helps/getter';
import { EthNetwork } from '../../helps/types';
import { getConfigByNetwork, loadConfig } from '../../helps/utils';
task('Upgrade:Vault', 'upgrade vault!').setAction(async (_, _HRE) => {
  await _HRE.run('set-HRE');

  const addressProvider = await getAddressProvider();
  await _HRE.run('wata:Vault');

  const NewVaultImpl = await getVaultImpl();

  const { MLTC } = loadConfig();
  const network = <EthNetwork>_HRE.network.name;
  const MLTCConfig = getConfigByNetwork(network, MLTC);

  await addressProvider.setVAULTImpl(
    false,
    MLTCConfig.owner,
    MLTCConfig.HLTC,
    MLTCConfig.HDOGE,
    MLTCConfig.HPT,
    await addressProvider.getStakingProxy(),
    await addressProvider.getLpStakingProxy(),
    NewVaultImpl.address
  );
  console.log('111', await (await getVaultImpl(await addressProvider.getVAULTProxy())).getTest());
});
