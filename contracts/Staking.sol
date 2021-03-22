//SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.1;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/SafeERC20.sol';
import '@openzeppelin/contracts/math/Math.sol';
import '@openzeppelin/contracts/math/SafeMath.sol';
import './lib/ReentrancyGuard.sol';
import './interfaces/IVault.sol';
import './interfaces/ILpStaking.sol';

import {VersionedInitializable} from './mocks/dependencies/VersionedInitializable.sol';

/**
 * Staking mLTC to mine HLTC + HDOGE + HPT
 */
contract Staking is VersionedInitializable, ReentrancyGuard {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  address public owner;
  bool public emergencyStop;

  mapping(address => uint256) public mLTCBalances;
  uint256 public totalSupply;

  uint256 public startMiningTime;

  address public mLTCUSDTLpStaking;
  address public mLTC;
  address public vault;

  uint256 public rewardLastUpdateTime;
  uint256 public sumHLTCPerToken;
  mapping(address => uint256) public userSumHLTCPerToken;
  mapping(address => uint256) public userUnclaimedHLTC;

  uint256 public sumHDOGEPerToken;
  mapping(address => uint256) public userSumHDOGEPerToken;
  mapping(address => uint256) public userUnclaimedHDOGE;

  uint256 public sumHPTPerToken;
  mapping(address => uint256) public userSumHPTPerToken;
  mapping(address => uint256) public userUnclaimedHPT;

  uint256 public curPeriodHLTC;
  uint256 public curPeriodHDOGE;
  uint256 public curPeriodHPT;
  uint256 public curPeriodStart;
  uint256 public curPeriodEnd;

  uint256 public constant REVISION = 0x1;

  function getRevision() internal pure virtual override returns (uint256) {
    return REVISION;
  }

  function initialize(
    address _owner,
    address _mLTC,
    address _mLTCUSDTLpStaking,
    address _vault
  ) external virtual initializer {
    require(_owner != address(0), 'new owner is the zero address');
    super.initialize();
    owner = _owner;
    mLTC = _mLTC;
    mLTCUSDTLpStaking = _mLTCUSDTLpStaking;
    vault = _vault;
  }

  /**
   * Set the reward and the time range of new peroid, and the time range is (block.timestamp, _endTime]
   */
  function addNewPeriodReward(
    uint256 rewardHLTC,
    uint256 rewardHDOGE,
    uint256 rewardHPT,
    uint256 _endTime
  ) external onlyVault refreshAccountReward(address(0)) {
    uint256 _startTime = block.timestamp;
    // Check whether the current period has finished, if not, the remaining reward will be put on the next peroid.
    if (curPeriodStart < _startTime && curPeriodEnd > _startTime) {
      uint256 factor = 100000000;
      uint256 left = curPeriodEnd.sub(_startTime).mul(factor).div(curPeriodEnd.sub(curPeriodStart));
      curPeriodHLTC = curPeriodHLTC.mul(left).div(factor).add(rewardHLTC);
      curPeriodHDOGE = curPeriodHDOGE.mul(left).div(factor).add(rewardHDOGE);
      curPeriodHPT = curPeriodHPT.mul(left).div(factor).add(rewardHPT);
    } else {
      // The current peroid has already been finished.
      curPeriodHLTC = rewardHLTC;
      curPeriodHDOGE = rewardHDOGE;
      curPeriodHPT = rewardHPT;
    }

    curPeriodStart = _startTime;
    curPeriodEnd = _endTime;
  }

  function stake(uint256 amount)
    external
    nonReentrant
    refreshAccountReward(msg.sender)
    notifyLpStaking()
  {
    require(amount > 0, 'Cannot stake 0');
    mLTCBalances[msg.sender] = mLTCBalances[msg.sender].add(amount);
    totalSupply = totalSupply.add(amount);
    IERC20(mLTC).safeTransferFrom(msg.sender, address(this), amount);
    emit Staked(msg.sender, amount);
  }

  function withdraw(uint256 amount)
    public
    nonReentrant
    refreshAccountReward(msg.sender)
    notifyLpStaking()
  {
    require(amount > 0, 'Cannot withdraw 0');
    totalSupply = totalSupply.sub(amount);
    mLTCBalances[msg.sender] = mLTCBalances[msg.sender].sub(amount);
    IERC20(mLTC).safeTransfer(msg.sender, amount);
    emit Withdrawn(msg.sender, amount);
  }

  function exit() external {
    withdraw(mLTCBalances[msg.sender]);
    claimReward();
  }

  function claimReward() public nonReentrant nonEmergencyStop refreshAccountReward(msg.sender) {
    uint256 hltc = userUnclaimedHLTC[msg.sender];
    if (hltc > 0) {
      userUnclaimedHLTC[msg.sender] = 0;
      IVault(vault).claimRewardHLTC(msg.sender, hltc);
    }
    uint256 hdoge = userUnclaimedHDOGE[msg.sender];
    if (hdoge > 0) {
      userUnclaimedHDOGE[msg.sender] = 0;
      IVault(vault).claimRewardHDOGE(msg.sender, hdoge);
    }
    uint256 hpt = userUnclaimedHPT[msg.sender];
    if (hpt > 0) {
      userUnclaimedHPT[msg.sender] = 0;
      IVault(vault).claimRewardHPT(msg.sender, hpt);
    }
    emit RewardPaid(msg.sender, hltc, hdoge, hpt);
  }

  function calRewardPerToken(uint256 _curRewardAmount) internal view returns (uint256) {
    if (block.timestamp <= startMiningTime || totalSupply == 0) {
      return 0;
    }
    uint256 startTime = rewardLastUpdateTime;
    uint256 endTime = block.timestamp;
    if (startTime == 0) {
      startTime = startMiningTime;
    }
    if (startTime < curPeriodStart) {
      startTime = curPeriodStart;
    }
    if (endTime > curPeriodEnd) {
      endTime = curPeriodEnd;
    }
    if (startTime < endTime && startTime >= curPeriodStart && endTime <= curPeriodEnd) {
      uint256 mLTCTotalSupply = IERC20(mLTC).totalSupply();
      uint256 curRewardAmount = _curRewardAmount.mul(totalSupply).div(mLTCTotalSupply);

      return
        curRewardAmount.mul(1e18).mul(endTime.sub(startTime)).div(totalSupply).div(
          curPeriodEnd.sub(curPeriodStart)
        );
    }
    return 0;
  }

  function getUnclaimedHLTC(address account) public view returns (uint256) {
    uint256 rewardPerToken =
      sumHLTCPerToken.add(calRewardPerToken(curPeriodHLTC)).sub(userSumHLTCPerToken[account]);
    return mLTCBalances[account].mul(rewardPerToken).div(1e18).add(userUnclaimedHLTC[account]);
  }

  function getUnclaimedHDOGE(address account) public view returns (uint256) {
    uint256 rewardPerToken =
      sumHDOGEPerToken.add(calRewardPerToken(curPeriodHDOGE)).sub(userSumHDOGEPerToken[account]);
    return mLTCBalances[account].mul(rewardPerToken).div(1e18).add(userUnclaimedHDOGE[account]);
  }

  function getUnclaimedHPT(address account) public view returns (uint256) {
    uint256 rewardPerToken =
      sumHPTPerToken.add(calRewardPerToken(curPeriodHPT)).sub(userSumHPTPerToken[account]);
    return mLTCBalances[account].mul(rewardPerToken).div(1e18).add(userUnclaimedHPT[account]);
  }

  function transferOwnership(address newOwner) external onlyOwner {
    require(newOwner != address(0), 'new owner is the zero address');
    emit OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }

  function setEmergencyStop(bool _emergencyStop) external onlyOwner {
    emergencyStop = _emergencyStop;
  }

  function setStartMiningTime(uint256 _startMiningTime) external onlyOwner {
    require(_startMiningTime > block.timestamp, 'nonlegal startMiningTime.');
    startMiningTime = _startMiningTime;
  }

  /* ========== MODIFIERS ========== */

  modifier refreshAccountReward(address account) {
    if (block.timestamp > startMiningTime) {
      sumHLTCPerToken = sumHLTCPerToken.add(calRewardPerToken(curPeriodHLTC));
      sumHDOGEPerToken = sumHDOGEPerToken.add(calRewardPerToken(curPeriodHDOGE));
      sumHPTPerToken = sumHPTPerToken.add(calRewardPerToken(curPeriodHPT));
      rewardLastUpdateTime = block.timestamp;
      if (account != address(0)) {
        userUnclaimedHLTC[account] = getUnclaimedHLTC(account);
        userSumHLTCPerToken[account] = sumHLTCPerToken;

        userUnclaimedHDOGE[account] = getUnclaimedHDOGE(account);
        userSumHDOGEPerToken[account] = sumHDOGEPerToken;

        userUnclaimedHPT[account] = getUnclaimedHPT(account);
        userSumHPTPerToken[account] = sumHPTPerToken;
      }
    }
    _;
  }

  modifier nonEmergencyStop() {
    require(emergencyStop == false, 'emergency stop');
    _;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, '!owner');
    _;
  }

  modifier onlyVault() {
    require(msg.sender == vault, '!vault');
    _;
  }

  modifier notifyLpStaking() {
    ILpStaking(mLTCUSDTLpStaking).refreshReward();
    _;
  }

  /* ========== EVENTS ========== */

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
  event Staked(address indexed user, uint256 amount);
  event Withdrawn(address indexed user, uint256 amount);
  event RewardPaid(address indexed user, uint256 hltc, uint256 hdoge, uint256 hpt);
}
