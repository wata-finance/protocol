//SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.1;

interface IStaking {
  function addNewPeriodReward(
    uint256 _rewardHLTC,
    uint256 _rewardHDOGE,
    uint256 _rewardHPT,
    uint256 _endTime
  ) external;

  function totalSupply() external view returns (uint256);
}
