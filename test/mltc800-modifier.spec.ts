const { expect } = require('chai');
import { makeSuite, TestEnv } from './utils/make-suite';
import { convertToCurrencyDecimals } from '../helps/utils';

makeSuite('MLTC: revert', (testEnv: TestEnv) => {
  it('mint: not owner', async () => {
    const { users, MLTC } = testEnv;
    await expect(MLTC.connect(users[1].signer).mint(users[1].address, 1000)).to.be.revertedWith(
      'Ownable: caller is not the owner'
    );
  });

  it('mint: owner', async () => {
    const { owner, MLTC } = testEnv;
    const amountToMint = await convertToCurrencyDecimals(MLTC.address, '10000');
    const toOwnerBalanceBefore = await MLTC.balanceOf(owner.address);
    await MLTC.connect(owner.signer).mint(owner.address, amountToMint);
    const toOwnerBalanceAfter = await MLTC.balanceOf(owner.address);
    expect(toOwnerBalanceAfter).to.be.equal(toOwnerBalanceBefore.add(amountToMint));
  });

  it('pause: not owner', async () => {
    const { users, MLTC } = testEnv;
    await expect(MLTC.connect(users[3].signer).pause()).to.be.revertedWith(
      'Ownable: caller is not the owner'
    );
  });

  it('unpause: not owner', async () => {
    const { users, MLTC } = testEnv;
    await expect(MLTC.connect(users[3].signer).unpause()).to.be.revertedWith(
      'Ownable: caller is not the owner'
    );
  });

  it('pause or unpause: owner', async () => {
    const { owner, MLTC } = testEnv;
    const amountToMint = await convertToCurrencyDecimals(MLTC.address, '10000');
    const toOwnerBalanceBefore = await MLTC.balanceOf(owner.address);

    await MLTC.connect(owner.signer).pause();
    await expect(MLTC.connect(owner.signer).mint(owner.address, amountToMint)).to.be.revertedWith(
      'token transfer while paused'
    );

    await MLTC.connect(owner.signer).unpause();
    await MLTC.connect(owner.signer).mint(owner.address, amountToMint);
    const toOwnerBalanceAfter = await MLTC.balanceOf(owner.address);
    expect(toOwnerBalanceAfter).to.be.equal(toOwnerBalanceBefore.add(amountToMint));
  });

  it('pause or unpause or mint: tranfer owner to newowner', async () => {
    const { users, owner, MLTC } = testEnv;
    const newowner = users[2].signer;
    const newOwnerAddress = users[2].address;
    await MLTC.connect(owner.signer).transferOwnership(newOwnerAddress);

    const amountToMint = await convertToCurrencyDecimals(MLTC.address, '10000');
    const toOwnerBalanceBefore = await MLTC.balanceOf(owner.address);
    const toNewOwnerBalanceBefore = await MLTC.balanceOf(newOwnerAddress);
    await expect(MLTC.connect(owner.signer).mint(owner.address, amountToMint)).to.be.revertedWith(
      'Ownable: caller is not the owner'
    );

    await expect(MLTC.connect(owner.signer).pause()).to.be.revertedWith(
      'Ownable: caller is not the owner'
    );

    await MLTC.connect(newowner).pause();
    await expect(MLTC.connect(newowner).mint(newOwnerAddress, amountToMint)).to.be.revertedWith(
      'token transfer while paused'
    );

    await expect(MLTC.connect(owner.signer).unpause()).to.be.revertedWith(
      'Ownable: caller is not the owner'
    );

    await MLTC.connect(newowner).unpause();
    await MLTC.connect(newowner).mint(newOwnerAddress, amountToMint);
    const toOwnerBalanceAfter = await MLTC.balanceOf(owner.address);
    const toNewOwnerBalanceAfter = await MLTC.balanceOf(newOwnerAddress);
    expect(toOwnerBalanceAfter).to.be.equal(toOwnerBalanceBefore);
    expect(toNewOwnerBalanceAfter).to.be.equal(toNewOwnerBalanceBefore.add(amountToMint));
  });
});
