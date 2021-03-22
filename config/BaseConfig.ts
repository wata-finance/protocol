import { IConfig, IWataConfig } from './types';
import { EthNetwork } from '../helps/types';
import { ZERO_ADDRESS } from '../helps/constants';

export const CommonConfig: IConfig = {
  LpStakingToken: {
    [EthNetwork.hardhat]: ZERO_ADDRESS,
    [EthNetwork.hecoTest]: '0x41a2c47fa2fdf360ef5cbb4396593f177debbb03',
    [EthNetwork.hecoMain]: undefined,
    [EthNetwork.bscTest]: '0xBcF3F7FB0A35603ACDea04dDED9C5c58566c8C64',
    [EthNetwork.bscMain]: undefined,
  },
  MLTC: {
    [EthNetwork.hardhat]: {
      name: 'mLTC',
      symbol: 'mLTC',
      HLTC: ZERO_ADDRESS,
      HDOGE: ZERO_ADDRESS,
      HPT: ZERO_ADDRESS,
      minter: '0xf90Eb5793E61280cEed29482Bf1bb8ab943AE7Ca',
      owner: '0xf90Eb5793E61280cEed29482Bf1bb8ab943AE7Ca',
    },
    [EthNetwork.hecoTest]: {
      name: 'MLTC',
      symbol: 'MLTC',
      HLTC: '0x13B456e06a401B5aF98c5C3B4937b84c9a700FD2',
      HDOGE: ZERO_ADDRESS,
      HPT: '0xAbE5acA6C8996482b6a7CD3f63A02FaBCc20BAE7',
      minter: '0xf90Eb5793E61280cEed29482Bf1bb8ab943AE7Ca',
      owner: '0xf90Eb5793E61280cEed29482Bf1bb8ab943AE7Ca',
    },
    [EthNetwork.hecoMain]: {
      name: '',
      symbol: '',
      HLTC: '',
      HDOGE: ZERO_ADDRESS,
      HPT: ZERO_ADDRESS,
      minter: '',
      owner: '0xf90Eb5793E61280cEed29482Bf1bb8ab943AE7Ca',
    },
    [EthNetwork.bscTest]: {
      name: 'MLTC',
      symbol: 'MLTC',
      HLTC: '0x70223a91D8CB5d8812366E6D6F4B6df2C2d3CC76',
      HDOGE: '0xD4af6aBBF19E677660D7982551b337Db06519C7A',
      HPT: ZERO_ADDRESS,
      minter: '0xf90Eb5793E61280cEed29482Bf1bb8ab943AE7Ca',
      owner: '0xf90Eb5793E61280cEed29482Bf1bb8ab943AE7Ca',
    },
    [EthNetwork.bscMain]: {
      name: '',
      symbol: '',
      HLTC: '',
      HDOGE: ZERO_ADDRESS,
      HPT: ZERO_ADDRESS,
      minter: '',
      owner: '0xf90Eb5793E61280cEed29482Bf1bb8ab943AE7Ca',
    },
  },
};

export const WataConfig: IWataConfig = {
  ...CommonConfig,
};
