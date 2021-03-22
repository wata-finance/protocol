import { task } from 'hardhat/config';
import { deployVault } from '../../helps/deploy';

task('wata:Vault', 'deploy Vault').setAction(async (_, _HRE) => {
  await _HRE.run('set-HRE');
  await deployVault();
});
