// SPDX-License-Identifier: agpl-3.0
pragma solidity >=0.7.1;

import {LpStaking} from '../../LpStaking.sol';

contract MockLpStaking is LpStaking {
  function getRevision() internal pure virtual override returns (uint256) {
    return 0x2;
  }

  function initialize(
    address newOwner,
    address _mLTC,
    address _vault,
    address _mLTCStaking,
    address _mLTCUSDTLpToken
  ) external virtual override initializer {
    require(newOwner != address(0), 'new owner is the zero address');
    super.initialize();
    owner = newOwner;
    mLTC = _mLTC;
    vault = _vault;
    mLTCUSDTLpToken = _mLTCUSDTLpToken;
    mLTCStaking = _mLTCStaking;

    sumHLTCPerToken = 0;
    sumHDOGEPerToken = 0;
    sumHPTPerToken = 0;
  }
}
