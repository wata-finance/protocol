//SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.1;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/SafeERC20.sol';
import '@openzeppelin/contracts/math/SafeMath.sol';
import './interfaces/IStaking.sol';
import './interfaces/ILpStaking.sol';
import {VersionedInitializable} from './mocks/dependencies/VersionedInitializable.sol';

/**
 * Mining reward pool with HLTC + HDOGE + HPT
 */
contract Vault is VersionedInitializable {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  address public owner;

  address public mLTCStaking;
  address public mLTCUSDTLpStaking;

  address public hLTC;
  address public hDOGE;
  address public hPT;

  uint256 public totalRewardHLTC;
  uint256 public totalRewardHDOGE;
  uint256 public totalRewardHPT;

  uint256 public curPeriodStart;
  uint256 public curPeriodEnd;

  uint256 public constant REVISION = 0x1;

  function getRevision() internal pure virtual override returns (uint256) {
    return REVISION;
  }

  function initialize(
    address _owner,
    address _hLTC,
    address _hDOGE,
    address _hPT,
    address _mLTCStaking,
    address _mLTCUSDTLpStaking
  ) external virtual initializer {
    require(_owner != address(0), 'new owner is the zero address');
    owner = _owner;
    hLTC = _hLTC;
    hDOGE = _hDOGE;
    hPT = _hPT;
    mLTCStaking = _mLTCStaking;
    mLTCUSDTLpStaking = _mLTCUSDTLpStaking;
  }

  /**
   * Set the reward and the time range of new peroid, and the time range is (block.timestamp, _endTime]
   */
  function addNewPeriodReward(
    uint256 _rewardHLTC,
    uint256 _rewardHDOGE,
    uint256 _rewardHPT,
    uint256 _endTime
  ) public onlyOwner {
    require(_endTime > block.timestamp, '_endTime >= block.timestamp !');
    require(
      _endTime >= curPeriodEnd,
      'The endTime of the latest period must be greater than the end time of the current period'
    );

    curPeriodStart = block.timestamp;
    curPeriodEnd = _endTime;

    if (_rewardHLTC > 0) {
      IERC20(hLTC).safeTransferFrom(msg.sender, address(this), _rewardHLTC);
    }
    if (_rewardHDOGE > 0) {
      IERC20(hDOGE).safeTransferFrom(msg.sender, address(this), _rewardHDOGE);
    }
    if (_rewardHPT > 0) {
      IERC20(hPT).safeTransferFrom(msg.sender, address(this), _rewardHPT);
    }
    IStaking(mLTCStaking).addNewPeriodReward(_rewardHLTC, _rewardHDOGE, _rewardHPT, _endTime);
    ILpStaking(mLTCUSDTLpStaking).addNewPeriodReward(
      _rewardHLTC,
      _rewardHDOGE,
      _rewardHPT,
      _endTime
    );
    totalRewardHLTC = totalRewardHLTC.add(_rewardHLTC);
    totalRewardHDOGE = totalRewardHDOGE.add(_rewardHDOGE);
    totalRewardHPT = totalRewardHPT.add(_rewardHPT);
    emit AddNewPeriodReward(_rewardHLTC, _rewardHDOGE, _rewardHPT, curPeriodStart, curPeriodEnd);
  }

  function claimRewardHLTC(address to, uint256 amount) external {
    require(to != address(0), 'to is the zero address');
    require(msg.sender == mLTCStaking || msg.sender == mLTCUSDTLpStaking, 'No permissions');
    IERC20(hLTC).safeTransfer(to, amount);
  }

  function claimRewardHDOGE(address to, uint256 amount) external {
    require(to != address(0), 'to is the zero address');
    require(msg.sender == mLTCStaking || msg.sender == mLTCUSDTLpStaking, 'No permissions');
    IERC20(hDOGE).safeTransfer(to, amount);
  }

  function claimRewardHPT(address to, uint256 amount) external {
    require(to != address(0), 'to is the zero address');
    require(msg.sender == mLTCStaking || msg.sender == mLTCUSDTLpStaking, 'No permissions');
    IERC20(hPT).safeTransfer(to, amount);
  }

  function transferOwnership(address newOwner) external onlyOwner {
    require(newOwner != address(0), 'new owner is the zero address');
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, '!owner');
    _;
  }

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
  event AddNewPeriodReward(
    uint256 _rewardHLTC,
    uint256 _rewardHDOGE,
    uint256 _rewardHPT,
    uint256 _startTime,
    uint256 _endTime
  );
}
