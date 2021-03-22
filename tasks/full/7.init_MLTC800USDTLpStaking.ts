import { task } from 'hardhat/config';

import { getAddressProvider, getLpStakingImpl, getMLTCImpl } from '../../helps/getter';
import { EthNetwork } from '../../helps/types';
import { getConfigByNetwork, loadConfig, waitForTx } from '../../helps/utils';

task('wata:init-LpStaking', 'Init  LpStaking Contract').setAction(async (_, _HRE) => {
  await _HRE.run('set-HRE');
  const addressProvider = await getAddressProvider();
  const LpStaking = (await getLpStakingImpl()).address;

  const { MLTC, LpStakingToken } = loadConfig();
  const network = <EthNetwork>_HRE.network.name;
  const MLTCConfig = getConfigByNetwork(network, MLTC);
  const mLTCUSDTLpStakingToken = getConfigByNetwork(network, LpStakingToken);
  const MLTCProxy = (await getMLTCImpl()).address;
  const VaultProxy = await addressProvider.getVAULTProxy();
  const StakingProxy = await addressProvider.getStakingProxy();

  if (mLTCUSDTLpStakingToken) {
    console.log('	-- Init LpStaking...');
    await waitForTx(
      await addressProvider.setLpStakingImpl(
        true,
        MLTCConfig.owner,
        MLTCProxy,
        VaultProxy,
        StakingProxy,
        mLTCUSDTLpStakingToken,
        LpStaking
      )
    );
  }
});
