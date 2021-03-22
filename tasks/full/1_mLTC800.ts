import { task } from 'hardhat/config';
import { deployMLTC } from '../../helps/deploy';

task('wata:MLTC', 'deploy MLTC').setAction(async (_, _HRE) => {
  await _HRE.run('set-HRE');
  await deployMLTC();
});
