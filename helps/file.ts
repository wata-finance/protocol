import { Contract } from 'ethers';

import { HRE } from './utils';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./deployed-contracts.json');
export const db = low(adapter);

export const insertContract = async (instance: Contract, contractName: string) => {
  const network = HRE.network.name;

  if (network != 'hardhat') {
    console.log(`*** ${contractName}.${network} ***\n`);
    console.log(` - Network: ${network}`);
    console.log(` - tx: ${instance.deployTransaction.hash}`);
    console.log(` - contract address: ${instance.address}`);
    console.log(` - dpeloyer address: ${instance.deployTransaction.from}`);
    console.log(` - gas price: ${instance.deployTransaction.gasPrice}`);
    console.log(` - gas used: ${instance.deployTransaction.gasPrice}`);
    console.log(`\n******`);
    console.log();
  }
  db.set(`${contractName}.${network}`, {
    address: instance.address,
    deployer: instance.deployTransaction.from,
  }).write();
};

export const getAddressByName = async (name: string) => {
  return db.get(`${name}.${HRE.network.name}`).value().address;
};

export const insertContractAddressInDB = async (contractName: string, address: string) => {
  db.set(`${contractName}.${HRE.network.name}`, {
    address: address,
  }).write();
};
