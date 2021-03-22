//SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.1;

contract ReentrancyGuard {
  bool private _notEntered;

  function initialize() internal {
    _notEntered = true;
  }

  modifier nonReentrant() {
    require(_notEntered, 'ReentrancyGuard: reentrant call');
    _notEntered = false;
    _;
    _notEntered = true;
  }
}
