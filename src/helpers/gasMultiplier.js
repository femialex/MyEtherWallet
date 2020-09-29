import BigNumber from 'bignumber.js';
import store from 'store';
const MED_CONST = 21.428571428571;
const MED_MULTIPLIER = 1.0714285714286;
const FAST_CONST = 42.857142857145;
const FAST_MULTIPLIER = 1.1428571428571;
const OLD_MED_CONST = 1.25;
const OLD_FAST_CONST = 1.5;
const LIMITER = 25;

const getEconomy = gasPrice => {
  return gasPrice > 1
    ? new BigNumber(gasPrice).div(1)
    : new BigNumber(gasPrice).div(1).toFixed();
};
const getRegular = gasPrice => {
  if (gasPrice > LIMITER) {
    let initialValue = new BigNumber(gasPrice).times(MED_MULTIPLIER);
    initialValue = initialValue.plus(MED_CONST);

    return new BigNumber(initialValue).toFixed();
  }

  return gasPrice * 1.25;
};
const getFast = gasPrice => {
  if (gasPrice > LIMITER) {
    let initialValue = new BigNumber(gasPrice).times(FAST_MULTIPLIER);
    initialValue = initialValue.plus(FAST_CONST);

    return new BigNumber(initialValue);
  }

  return gasPrice * 1.5;
};

const fastToEconomy = gasPrice => {
  const oldConverted = gasPrice / OLD_FAST_CONST;
  if (LIMITER > oldConverted) {
    return oldConverted;
  }
  let initialValue = new BigNumber(gasPrice).minus(FAST_CONST);
  initialValue = initialValue.div(FAST_MULTIPLIER);
  return new BigNumber(initialValue);
};

const regularToEconomy = gasPrice => {
  const oldConverted = gasPrice / OLD_MED_CONST;
  if (LIMITER > oldConverted) {
    return oldConverted;
  }
  let initialValue = new BigNumber(gasPrice).minus(MED_CONST);
  initialValue = initialValue.div(MED_MULTIPLIER);
  return new BigNumber(initialValue);
};

const getGasBasedOnType = gasPrice => {
  const gasPriceType = store.get('gasPriceType') || 'economy';
  const storedPrice = store.get('gasPrice') || 0;
  switch (gasPriceType) {
    case 'economy':
      return getEconomy(gasPrice);
    case 'regular':
      return getRegular(gasPrice);
    case 'fast':
      return getFast(gasPrice);
    default:
      return storedPrice;
  }
};

export {
  getEconomy,
  getRegular,
  getFast,
  getGasBasedOnType,
  fastToEconomy,
  regularToEconomy
};
