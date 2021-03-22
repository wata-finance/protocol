// SPDX-License-Identifier: agpl-3.0
pragma solidity >=0.7.1;

import {Staking} from '../../Staking.sol';

contract MockStaking is Staking {
  function getRevision() internal pure virtual override returns (uint256) {
    return 0x2;
  }

  function initialize(
    address _owner,
    address _mLTC,
    address _mLTCUSDTLpStaking,
    address _vault
  ) external virtual override initializer {
    require(_owner != address(0), 'new owner is the zero address');
    super.initialize();
    owner = _owner;
    mLTC = _mLTC;
    mLTCUSDTLpStaking = _mLTCUSDTLpStaking;
    vault = _vault;

    sumHLTCPerToken = 0;
    sumHDOGEPerToken = 0;
    sumHPTPerToken = 0;
  }
}
