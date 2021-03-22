// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
import {Ownable} from './mocks/dependencies/Ownable.sol';
import {IAddressProvider} from './interfaces/IAddressProvider.sol';
import {
  InitializableImmutableAdminUpgradeabilityProxy
} from './lib/upgrade/InitializableImmutableAdminUpgradeabilityProxy.sol';

contract AddressProvider is Ownable, IAddressProvider {
  mapping(string => address) private _addresses;
  string private constant STAKING = 'STAKING';
  string private constant LPSTAKING = 'LPSTAKING';
  string private constant VAULT = 'VAULT';

  function getVAULTProxy() external view override returns (address) {
    return _addresses[VAULT];
  }

  function getStakingProxy() external view override returns (address) {
    return _addresses[STAKING];
  }

  function getLpStakingProxy() external view override returns (address) {
    return _addresses[LPSTAKING];
  }

  function setProxy(string memory name) external override onlyOwner {
    InitializableImmutableAdminUpgradeabilityProxy proxy =
      new InitializableImmutableAdminUpgradeabilityProxy(address(this));
    _addresses[name] = address(proxy);
  }

  function setVAULTImpl(
    bool isInit,
    address newOwner,
    address _hLTC,
    address _hDOGE,
    address _hPT,
    address _mLTCStaking,
    address _mLTCUSDTLpStaking,
    address newAddress
  ) external override onlyOwner {
    address payable proxyAddress = payable(_addresses[VAULT]);

    InitializableImmutableAdminUpgradeabilityProxy proxy =
      InitializableImmutableAdminUpgradeabilityProxy(proxyAddress);
    bytes memory params =
      abi.encodeWithSignature(
        'initialize(address,address,address,address,address,address)',
        newOwner,
        _hLTC,
        _hDOGE,
        _hPT,
        _mLTCStaking,
        _mLTCUSDTLpStaking
      );
    if (isInit) {
      proxy.initialize(newAddress, params);
      _addresses[VAULT] = address(proxy);
      emit VAULTProxyCreated(VAULT, address(proxy));
    } else {
      proxy.upgradeToAndCall(newAddress, params);
    }
    emit VAULTUpdated(newAddress);
  }

  function setStakingImpl(
    bool isInit,
    address newOwner,
    address _mLTC,
    address _mLTCUSDTLpStaking,
    address _vault,
    address newAddress
  ) external override onlyOwner {
    address payable proxyAddress = payable(_addresses[STAKING]);

    InitializableImmutableAdminUpgradeabilityProxy proxy =
      InitializableImmutableAdminUpgradeabilityProxy(proxyAddress);
    bytes memory params =
      abi.encodeWithSignature(
        'initialize(address,address,address,address)',
        newOwner,
        _mLTC,
        _mLTCUSDTLpStaking,
        _vault
      );
    if (isInit) {
      proxy.initialize(newAddress, params);
      _addresses[STAKING] = address(proxy);
      emit StakingProxyCreated(STAKING, address(proxy));
    } else {
      proxy.upgradeToAndCall(newAddress, params);
    }
    emit StakingUpdated(newAddress);
  }

  function setLpStakingImpl(
    bool isInit,
    address newOwner,
    address _mLTC,
    address _vault,
    address _mLTCStaking,
    address _mLTCUSDTLpToken,
    address newAddress
  ) external override onlyOwner {
    address payable proxyAddress = payable(_addresses[LPSTAKING]);

    InitializableImmutableAdminUpgradeabilityProxy proxy =
      InitializableImmutableAdminUpgradeabilityProxy(proxyAddress);
    bytes memory params =
      abi.encodeWithSignature(
        'initialize(address,address,address,address,address)',
        newOwner,
        _mLTC,
        _vault,
        _mLTCStaking,
        _mLTCUSDTLpToken
      );
    if (isInit) {
      proxy.initialize(newAddress, params);
      _addresses[LPSTAKING] = address(proxy);
      emit ILpStakingProxyCreated(LPSTAKING, address(proxy));
    } else {
      proxy.upgradeToAndCall(newAddress, params);
    }
    emit LpStakingUpdated(newAddress);
  }
}
