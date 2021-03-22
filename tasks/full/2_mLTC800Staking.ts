import { task } from 'hardhat/config';
import { deployStaking } from '../../helps/deploy';

task('wata:Staking', 'deploy Staking').setAction(async (_, _HRE) => {
  await _HRE.run('set-HRE');
  await deployStaking();
});
