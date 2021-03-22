import { ContractName, MockContractName } from './types';
import { HRE } from './utils';
import { db } from './file';
import { AddressProvider__factory } from '../types/factories/AddressProvider__factory';
import { MLTC__factory } from '../types/factories/MLTC__factory';
import { Staking__factory } from '../types/factories/Staking__factory';
import { LpStaking__factory } from '../types/factories/LpStaking__factory';
import { MintableERC20__factory } from '../types/factories/MintableERC20__factory';
import { Vault__factory } from '../types/factories/Vault__factory';

export const getEthSigners = async () => {
  return await HRE.ethers.getSigners();
};

export const getFirstSigner = async () => {
  return (await HRE.ethers.getSigners())[0];
};

export const getAddressProvider = async (address?: string) => {
  let currentAddress =
    address || db.get(`${ContractName.AddressProvider}.${HRE.network.name}`).value().address;
  return await AddressProvider__factory.connect(currentAddress, await getFirstSigner());
};

export const getMLTCImpl = async (address?: string) => {
  let currentAddress =
    address || db.get(`${ContractName.MLTCImpl}.${HRE.network.name}`).value().address;
  return await MLTC__factory.connect(currentAddress, await getFirstSigner());
};

export const getVaultImpl = async (address?: string) => {
  let currentAddress =
    address || db.get(`${ContractName.VaultImpl}.${HRE.network.name}`).value().address;
  return await Vault__factory.connect(currentAddress, await getFirstSigner());
};

export const getStaking = async (address?: string) => {
  let currentAddress =
    address || db.get(`${ContractName.StakingImpl}.${HRE.network.name}`).value().address;
  return await Staking__factory.connect(currentAddress, await getFirstSigner());
};

export const getLpStakingImpl = async (address?: string) => {
  let currentAddress =
    address || db.get(`${ContractName.LpStakingImpl}.${HRE.network.name}`).value().address;
  return await LpStaking__factory.connect(currentAddress, await getFirstSigner());
};

export const getMintableERC20 = async (address?: string) => {
  let currentAddress =
    address || db.get(`${MockContractName.MintableERC20}.${HRE.network.name}`).value().address;
  return await MintableERC20__factory.connect(currentAddress, await getFirstSigner());
};
