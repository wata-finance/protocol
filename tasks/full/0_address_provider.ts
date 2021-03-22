import { load } from 'dotenv/types';
import { task } from 'hardhat/config';

import { deployAddressProvider } from '../../helps/deploy';
import { getAddressProvider } from '../../helps/getter';

task('wata:deploy-address-provider', 'deploy address provider').setAction(async (_, _HRE) => {
  await _HRE.run('set-HRE');
  await deployAddressProvider();
  await getAddressProvider();
});
