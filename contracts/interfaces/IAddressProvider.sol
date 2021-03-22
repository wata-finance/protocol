// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

interface IAddressProvider {
  event VAULTUpdated(address indexed newAddress);
  event StakingUpdated(address indexed newAddress);
  event LpStakingUpdated(address indexed newAddress);

  event VAULTProxyCreated(string id, address indexed newAddress);
  event StakingProxyCreated(string id, address indexed newAddress);
  event ILpStakingProxyCreated(string id, address indexed newAddress);

  function getVAULTProxy() external view returns (address);

  function getStakingProxy() external view returns (address);

  function getLpStakingProxy() external view returns (address);

  function setVAULTImpl(
    bool isInit,
    address _owner,
    address _hLTC,
    address _hDOGE,
    address _hPT,
    address _mLTCStaking,
    address _mLTCUSDTLpStaking,
    address newAddress
  ) external;

  function setStakingImpl(
    bool isInit,
    address _owner,
    address _mLTC,
    address _mLTCUSDTLpStaking,
    address _vault,
    address newAddres
  ) external;

  function setLpStakingImpl(
    bool isInit,
    address _owner,
    address _mLTC,
    address _vault,
    address _mLTCStaking,
    address _mLTCUSDTLpToken,
    address newAddress
  ) external;

  function setProxy(string memory name) external;
}
