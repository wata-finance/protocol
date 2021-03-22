import { task } from 'hardhat/config';
import { deployLpStaking } from '../../helps/deploy';

task('wata:LpStaking', 'deploy LpStaking').setAction(async (_, _HRE) => {
  await _HRE.run('set-HRE');
  await deployLpStaking();
});
