import { task } from 'hardhat/config';
task('deploy:wata', 'deploy wata system!').setAction(async (_, HRE) => {
  await HRE.run('set-HRE');
  console.log('-----Deploy address provider...');
  await HRE.run('wata:deploy-address-provider');

  console.log('-----Deploy MLTC...');
  await HRE.run('wata:MLTC');

  console.log('-----Deploy Staking...');
  await HRE.run('wata:Staking');

  console.log('-----Deploy LpStaking...');
  await HRE.run('wata:LpStaking');

  console.log('-----Deploy Vault...');
  await HRE.run('wata:Vault');

  console.log('-----Set Proxy...');
  await HRE.run('wata:setProxy');

  console.log('-----Init contract...');
  await HRE.run('wata:init');

  console.log('-----Init LpStaking...');
  await HRE.run('wata:init-LpStaking');
});
