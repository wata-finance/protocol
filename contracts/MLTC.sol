//SPDX-License-Identifier: Unlicense
pragma solidity >=0.7.1;

import '@openzeppelin/contracts/math/SafeMath.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

/**
 * Each mLTC is collateralized by 1 mega hash per second (MH/s) standardized mining power of a mining machine(Litecoin) with 800W/h power consumption.
 */
contract MLTC is ERC20, ERC20Pausable, Ownable {
  using SafeMath for uint256;

  // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md
  // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2612.md
  bytes32 public DOMAIN_SEPARATOR;
  // keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)");
  bytes32 public constant PERMIT_TYPEHASH =
    0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9;
  mapping(address => uint256) public nonces;

  constructor() public ERC20('Litecoin Standard Hashrate Token', 'mLTC') {
    uint256 chainId;
    assembly {
      chainId := chainid()
    }

    DOMAIN_SEPARATOR = keccak256(
      abi.encode(
        keccak256(
          'EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'
        ),
        keccak256(bytes('Litecoin Standard Hashrate Token')),
        keccak256(bytes('1')),
        chainId,
        address(this)
      )
    );
  }

  function permit(
    address _owner,
    address spender,
    uint256 value,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) external {
    require(deadline >= block.timestamp, 'MLTC: EXPIRED');
    bytes32 digest =
      keccak256(
        abi.encodePacked(
          '\x19\x01',
          DOMAIN_SEPARATOR,
          keccak256(abi.encode(PERMIT_TYPEHASH, _owner, spender, value, nonces[_owner]++, deadline))
        )
      );
    address recoveredAddress = ecrecover(digest, v, r, s);
    require(
      recoveredAddress != address(0) && recoveredAddress == _owner,
      'MLTC: INVALID_SIGNATURE'
    );
    _approve(_owner, spender, value);
  }

  function mint(address to, uint256 value) external onlyOwner {
    _mint(to, value);
  }

  function pause() external onlyOwner {
    _pause();
  }

  function unpause() external onlyOwner {
    _unpause();
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal override(ERC20, ERC20Pausable) {
    super._beforeTokenTransfer(from, to, amount);
  }
}
