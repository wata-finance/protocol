import { Signer } from 'ethers';

import {
  getAddressProvider,
  getEthSigners,
  getMintableERC20,
  getLpStakingImpl,
  getMLTCImpl,
  getStaking,
  getVaultImpl,
} from '../../helps/getter';
import { AddressProvider } from '../../types/AddressProvider';
import { HRE, evmSnapshot, evmRevert } from '../../helps/utils';
import { MLTC } from '../../types/MLTC';
import { Staking } from '../../types/Staking';
import { MintableERC20 } from '../../types/MintableERC20';
import { MockToken } from '../../helps/types';
import { getAddressByName } from '../../helps/file';
import { LpStaking } from '../../types/LpStaking';
import { Vault } from '../../types/Vault';

export interface TestEnv {
  deployer: {
    signer: Signer;
    address: string;
  };
  miner: {
    signer: Signer;
    address: string;
  };
  users: {
    signer: Signer;
    address: string;
  }[];
  addressProvider: AddressProvider;
  MLTC: MLTC;
  Staking: Staking;
  LpStaking: LpStaking;
  Vault: Vault;
  MLTCUSDTLp: MintableERC20;
  HLTC: MintableERC20;
  HPT: MintableERC20;
  owner: {
    signer: Signer;
    address: string;
  };
}

const testEnv: TestEnv = {
  deployer: {} as {
    signer: Signer;
    address: string;
  },
  miner: {} as {
    signer: Signer;
    address: string;
  },
  users: [] as {
    signer: Signer;
    address: string;
  }[],
  owner: {} as {
    signer: Signer;
    address: string;
  },
  addressProvider: {} as AddressProvider,
  MLTC: {} as MLTC,
  Staking: {} as Staking,
  LpStaking: {} as LpStaking,
  Vault: {} as Vault,
  MLTCUSDTLp: {} as MintableERC20,
  HLTC: {} as MintableERC20,
  HPT: {} as MintableERC20,
};

let buidlerevmSnapshotId: string = '0x1';
const setBuidlerevmSnapshotId = (id: string) => {
  if (HRE.network.name === 'hardhat') {
    buidlerevmSnapshotId = id;
  }
};

export function makeSuite(name: string, tests: (testEnv: TestEnv) => void) {
  describe(name, () => {
    before(async () => {
      setBuidlerevmSnapshotId(await evmSnapshot());
    });
    tests(testEnv);
    after(async () => {
      await evmRevert(buidlerevmSnapshotId);
    });
  });
}

export async function initializeMakeSuite(_hre) {
  const [_deployer, ...withoutFirstSigners] = await getEthSigners();

  for (const _signer of withoutFirstSigners) {
    testEnv.users.push({
      address: await _signer.getAddress(),
      signer: _signer,
    });
  }
  testEnv.deployer = {
    address: await _deployer.getAddress(),
    signer: _deployer,
  };
  testEnv.addressProvider = await getAddressProvider();
  testEnv.MLTC = await getMLTCImpl();
  testEnv.Staking = await getStaking(await testEnv.addressProvider.getStakingProxy());
  testEnv.LpStaking = await getLpStakingImpl(await testEnv.addressProvider.getLpStakingProxy());
  testEnv.MLTCUSDTLp = await getMintableERC20(await getAddressByName(MockToken.MLTCUSDTLp.symbol));
  testEnv.Vault = await getVaultImpl(await testEnv.addressProvider.getVAULTProxy());
  testEnv.HLTC = await getMintableERC20(await getAddressByName(MockToken.HLTC.symbol));
  testEnv.HPT = await getMintableERC20(await getAddressByName(MockToken.HPT.symbol));
  testEnv.owner = testEnv.deployer;
  testEnv.miner = testEnv.deployer;
}
