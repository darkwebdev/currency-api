'use strict';

const expect = require('chai').expect;

const converted = require('../src/converted');

describe('converter', () => {
  const from = 'eur';
  const to = 'usd';
  const precision = 4;

  describe('given no input/output currency', () => {
    it('should return undefined', () => {
      expect(converted({ rates: {} })).to.be.undefined;
    });
  });

  describe('given no input currency', () => {
    it('should return undefined', () => {
      expect(converted({ rates: {}, to })).to.be.undefined;
    });
  });

  describe('given no output currency', () => {
    it('should return undefined', () => {
      expect(converted({ rates: {}, from })).to.be.undefined;
    });
  });

  describe('given no currency amount', () => {
    it('should return just a rate', () => {
      const rate = 1.1;
      const rates = { EUR: 1, USD: rate };

      expect(converted({ rates, from, to })).to.equal(rate);
    });
  });

  describe('given rate 1:1', () => {
    it('should return the same amount', () => {
      const amount = 10;
      const rates = { EUR: 1, USD: 1 };

      expect(converted({ rates, from, to, amount })).to.equal(amount);
    });
  });

  describe('given rate 2:1', () => {
    it('should return half the amount', () => {
      const amount = 10;
      const rates = { EUR: 2, USD: 1 };

      expect(converted({ rates, from, to, amount })).to.equal(amount/2);
    });
  });

  describe('given rate 1:2', () => {
    it('should return half the amount', () => {
      const amount = 10;
      const rates = { EUR: 2, GBP: 1 };

      expect(converted({ rates, from: 'gbp', to: 'eur', amount })).to.equal(amount*2);
    });
  });

  describe('given rate 1:1.1788', () => {
    it('should avoid floating-point problems', () => {
      const amount = 11;
      const rates = { EUR: 1, USD: 1.1788 };

      expect(converted({ rates, precision, from, to, amount })).to.equal(12.9668);
    });
  });

});
