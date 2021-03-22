//SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.1;

interface IVault {
  function claimRewardHLTC(address to, uint256 amount) external;

  function claimRewardHDOGE(address to, uint256 amount) external;

  function claimRewardHPT(address to, uint256 amount) external;
}
