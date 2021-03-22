import { BigNumber } from 'bignumber.js';
import { expect } from 'chai';
import { assert } from 'console';

import { PoolData, UserData } from '../../helps/types';

export const almostEqual = (actual: PoolData | UserData, expected: PoolData | UserData) => {
  const keys = Object.keys(actual);

  keys.forEach((key) => {
    if (key === 'startMiningTime' || key === 'MLTCTotalSupply' || key === 'StakingTotalSupply') {
      // skipping consistency check on accessory data
      return;
    }

    assert(actual[key] != undefined, `Property ${key} is undefined in the actual data`);
    expect(expected[key] != undefined, `Property ${key} is undefined in the expected data`);

    if (expected[key] == null || actual[key] == null) {
      console.log('Found a undefined value for Key ', key, ' value ', expected[key], actual[key]);
    }

    if (actual[key] instanceof BigNumber) {
      const actualValue = (<BigNumber>actual[key]).decimalPlaces(0, BigNumber.ROUND_DOWN);
      const expectedValue = (<BigNumber>expected[key]).decimalPlaces(0, BigNumber.ROUND_DOWN);
      assert(
        actualValue.eq(expectedValue) ||
          actualValue.plus(1).eq(expectedValue) ||
          actualValue.eq(expectedValue.plus(1)) ||
          actualValue.plus(2).eq(expectedValue) ||
          actualValue.eq(expectedValue.plus(2)) ||
          actualValue.plus(3).eq(expectedValue) ||
          actualValue.eq(expectedValue.plus(3)),
        `expected #{act} to be almost equal or equal #{exp} for property ${key}`,
        `expected #{act} to be almost equal or equal #{exp} for property ${key}`,
        expectedValue.toFixed(0),
        actualValue.toFixed(0)
      );
    } else {
      assert(
        actual[key] !== null &&
          expected[key] !== null &&
          actual[key].toString() === expected[key].toString(),
        `expected #{act} to be equal #{exp} for property ${key}`,
        `expected #{act} to be equal #{exp} for property ${key}`,
        expected[key],
        actual[key]
      );
    }
  });
};
