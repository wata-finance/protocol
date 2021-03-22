import { task } from 'hardhat/config';
import { insertContractAddressInDB } from '../../helps/file';

import { getAddressProvider } from '../../helps/getter';
import { ContractName } from '../../helps/types';
import { waitForTx } from '../../helps/utils';

task('wata:setProxy', 'Set proxy').setAction(async (_, _HRE) => {
  await _HRE.run('set-HRE');
  const addressProvider = await getAddressProvider();
  console.log('	-- Set proxy address');
  await waitForTx(await addressProvider.setProxy('STAKING'));
  await insertContractAddressInDB(
    ContractName.StakingProxy,
    await addressProvider.getStakingProxy()
  );
  await waitForTx(await addressProvider.setProxy('LPSTAKING'));
  await insertContractAddressInDB(
    ContractName.LpStakingProxy,
    await addressProvider.getLpStakingProxy()
  );
  await waitForTx(await addressProvider.setProxy('VAULT'));
  await insertContractAddressInDB(ContractName.VaultProxy, await addressProvider.getVAULTProxy());
});
