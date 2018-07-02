'use strict';

module.exports = ({ rates, precision, from, to, amount }) => {
  if (from && to) {
    const factor = Math.pow(10, precision || 0);
    const rate = (rates[to.toUpperCase()] / rates[from.toUpperCase()]) * factor;

    return rate ? (rate * Number(amount || 1)) / factor : undefined;
  }
};
