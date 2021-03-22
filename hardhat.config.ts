import path from 'path';
import fs from 'fs';

import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-typechain';
import { EthNetwork } from './helps/types';
// import 'hardhat-contract-sizer';
require('dotenv').config();
const SKIP_LOAD = process.env.SKIP_LOAD === 'true';
const INFURA_KEY = process.env.INFURA_KEY || '';
const MNEMONIC = process.env.MNEMONIC || '';
const DEFAULT_BLOCK_GAS_LIMIT = 12450000;
const DEFAULT_GAS_PRICE = 2000000000;
const DEFAULT_GAS_MUL = 5;
if (!SKIP_LOAD) {
  require('./tasks/wata.deploy');
  ['utils', 'full', 'upgrade'].forEach((folder) => {
    const tasksPath = path.join(__dirname, 'tasks', folder);
    fs.readdirSync(tasksPath)
      .filter((pth) => pth.includes('.ts'))
      .forEach((task) => {
        require(`${tasksPath}/${task}`);
      });
  });
}

const getNetworkConfig = (networkName: string, networkId: number) => {
  let url = `https://${networkName}.infura.io/v3/${INFURA_KEY}`;
  switch (networkId) {
    case 256:
      url = 'https://http-testnet.hecochain.com';
      break;
    case 128:
      url = 'https://http-mainnet.hecochain.com';
      break;
    case 97:
      url = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
      break;
    case 56:
      url = 'https://bsc-dataseed.binance.org/';
      break;
  }
  return {
    url: url,
    chainId: networkId,
    accounts: {
      mnemonic: MNEMONIC,
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      gasMultiplier: DEFAULT_GAS_MUL,
      gasPrice: DEFAULT_GAS_PRICE,
    },
  };
};

module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.6.12',
        settings: {
          optimizer: { enabled: true, runs: 200 },
          evmVersion: 'istanbul',
        },
      },
      {
        version: '0.7.1',
        settings: {
          optimizer: { enabled: true, runs: 200 },
          evmVersion: 'istanbul',
        },
      },
    ],
  },
  typechain: {
    outDir: 'types',
    target: 'ethers-v5',
  },
  networks: {
    hecoTest: getNetworkConfig(EthNetwork.hecoTest, 256),
    hecoMain: getNetworkConfig(EthNetwork.hecoMain, 128),
    bscTest: getNetworkConfig(EthNetwork.hecoTest, 97),
    bscMain: getNetworkConfig(EthNetwork.hecoMain, 56),
  },
  gasReporter: {
    currency: 'CHF',
    gasPrice: 21,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
};
