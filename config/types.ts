import { EthNetwork } from '../helps/types';

export interface IParamsPerNetwork<T> {
  [EthNetwork.hecoMain]: T;
  [EthNetwork.hecoTest]: T;
  [EthNetwork.hardhat]: T;
  [EthNetwork.bscMain]: T;
  [EthNetwork.bscTest]: T;
}
export interface IMLTC {
  name: string;
  symbol: string;
  minter: string;
  HLTC: string;
  HDOGE: string;
  HPT: string;
  owner: string;
}
export interface IConfig {
  LpStakingToken: IParamsPerNetwork<string | undefined>;
  MLTC: IParamsPerNetwork<IMLTC>;
}
export interface IWataConfig extends IConfig {}
