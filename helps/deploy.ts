import { insertContractAddressInDB } from './file';
import { ContractName, MockContractName, MockToken } from './types';
import { withSave, HRE } from './utils';

export const deployAddressProvider = async () => {
  const factory = await HRE.ethers.getContractFactory(ContractName.AddressProvider);
  return await withSave(await factory.deploy(), ContractName.AddressProvider);
};

export const deployMLTC = async () => {
  const factory = await HRE.ethers.getContractFactory(ContractName.MLTC);
  const instance = await factory.deploy();
  insertContractAddressInDB(ContractName.MLTCProxy, await instance.address);
  return await withSave(instance, ContractName.MLTCImpl);
};

export const deployStaking = async () => {
  const factory = await HRE.ethers.getContractFactory(ContractName.Staking);
  return await withSave(await factory.deploy(), ContractName.StakingImpl);
};

export const deployLpStaking = async () => {
  const factory = await HRE.ethers.getContractFactory(ContractName.LpStaking);
  return await withSave(await factory.deploy(), ContractName.LpStakingImpl);
};

export const deployVault = async () => {
  const factory = await HRE.ethers.getContractFactory(ContractName.Vault);
  return await withSave(await factory.deploy(), ContractName.VaultImpl);
};

export const deployMockVault = async () => {
  const factory = await HRE.ethers.getContractFactory(MockContractName.MockVault);
  return await withSave(await factory.deploy(), MockContractName.MockVault);
};

export const deployMockStaking = async () => {
  const factory = await HRE.ethers.getContractFactory(MockContractName.MockStaking);
  return await withSave(await factory.deploy(), MockContractName.MockStaking);
};

export const deployMockLpStaking = async () => {
  const factory = await HRE.ethers.getContractFactory(MockContractName.MockLpStaking);
  return await withSave(await factory.deploy(), MockContractName.MockLpStaking);
};
