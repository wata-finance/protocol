// SPDX-License-Identifier: agpl-3.0
pragma solidity >=0.7.1;

import {Vault} from '../../Vault.sol';

contract MockVault is Vault {
  function getRevision() internal pure virtual override returns (uint256) {
    return 0x2;
  }

  function initialize(
    address newOwner,
    address _hLTC,
    address _hDOGE,
    address _hPT,
    address _mLTCStaking,
    address _mLTCUSDTLpStaking
  ) external virtual override initializer {
    require(newOwner != address(0), 'new owner is the zero address');
    owner = newOwner;
    hLTC = _hLTC;
    hDOGE = _hDOGE;
    hPT = _hPT;
    mLTCStaking = _mLTCStaking;
    mLTCUSDTLpStaking = _mLTCUSDTLpStaking;
  }
}
