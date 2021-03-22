import getOwnPropertyDescriptor = Reflect.getOwnPropertyDescriptor;

const { expect } = require('chai');
import { makeSuite, TestEnv } from './utils/make-suite';
import { convertToCurrencyDecimals } from '../helps/utils';
import { ZERO_ADDRESS } from '../helps/constants';

makeSuite('MLTC', (testEnv: TestEnv) => {
  it('MLTC basic', async () => {
    const { MLTC, users, deployer } = testEnv;
    expect(await MLTC.name()).to.be.equal('Litecoin Standard Hashrate Token');
    expect(await MLTC.symbol()).to.be.equal('mLTC');
    expect(await MLTC.decimals()).to.be.equal(18);
    expect(await MLTC.owner()).to.be.equal(deployer.address);
    expect(await MLTC.paused()).to.be.equal(false);
  });

  it('MLTC Mint 10000 token not owner (revert)', async () => {
    const { MLTC, users } = testEnv;
    const to = users[1].address;
    const amountToMint = 10000;
    await expect(MLTC.connect(users[2].signer).mint(to, amountToMint)).to.be.revertedWith(
      'Ownable: caller is not the owner'
    );
  });

  it('MLTC Mint 10000 token of minter to user1 and user2 and self', async () => {
    const { MLTC, deployer, users } = testEnv;
    const toOne = users[1].address;
    const toTwo = users[2].address;
    const amountToMint = await convertToCurrencyDecimals(MLTC.address, '10000');
    await MLTC.connect(deployer.signer).mint(toOne, amountToMint);
    await MLTC.connect(deployer.signer).mint(toTwo, amountToMint);
    await MLTC.connect(deployer.signer).mint(MLTC.address, amountToMint);
    const totalSupplyAfter = await MLTC.totalSupply();
    const toOneBalanceAfter = await MLTC.balanceOf(toOne);
    const toTwoBalanceAfter = await MLTC.balanceOf(toTwo);
    const MLTCBalanceAfter = await MLTC.balanceOf(MLTC.address);

    expect(totalSupplyAfter).to.be.eq(amountToMint.mul(3));
    expect(toOneBalanceAfter).to.be.eq(amountToMint);
    expect(toTwoBalanceAfter).to.be.eq(amountToMint);
    expect(MLTCBalanceAfter).to.be.eq(amountToMint);
  });

  it('MLTC transfer owner to user 2', async () => {
    const { MLTC, users } = testEnv;
    const newOwnerAddress = users[1].address;
    await MLTC.transferOwnership(newOwnerAddress);

    const owner = await MLTC.owner();
    expect(owner).to.be.eq(newOwnerAddress);
  });
});
